import { z } from 'zod';
import type { Donation } from '@/domain/Donation';

const createTransactionPaymentSchema = z.object({
  ReturnCode: z.string(),
  ReturnDesc: z.string(),
  PaymentURL: z.string().url(),
  PaymentId: z.string(),
});

export async function createTransactionPayment(donation: Donation, sessionToken: string) {
  console.log("REPONSE1 ==> ", sessionToken);

  const response = await fetch(`${process.env.ECOLLECT_API_URL}/createTransactionPayment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      EntityCode: process.env.ECOLLECT_ENTITY_CODE,
      SessionToken: sessionToken,
      SrvCode: '1002',
      TransValue: donation.amount,
      URLRedirect: `${process.env.NEXT_PUBLIC_BASE_URL}/resultado?reference=${donation.reference}`,
      URLResponse: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/ecollect`,
      referenceArray: [
        donation.id_number, // [0] Documento o ID único
        'DONACION', // [1] Referencia secundaria
        `Donación para ${donation.destination}`, // [2] Descripción
        donation.id_type, // [3] Tipo de documento
        donation.address, // [4] Dirección
        donation.mobile, // [5] Teléfono/Celular
        donation.email, // [6] Email
      ],
    }),
  });

  console.log("REPONSE ==> ", response)

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('eCollect createTransactionPayment failed:', errorBody);
    throw new Error(`Failed to create transaction payment with eCollect: ${errorBody}`);
  }

  const data = await response.json();
  const parsedData = createTransactionPaymentSchema.safeParse(data);

  if (!parsedData.success) {
    console.error('Invalid create transaction payment response from eCollect:', parsedData.error);
    throw new Error('Invalid create transaction payment response from eCollect');
  }

  return parsedData.data;
}
