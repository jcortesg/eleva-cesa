
import { z } from 'zod';
import type { Donation } from '@/domain/Donation';

const createTransactionPaymentSchema = z.object({
  ReturnCode: z.string(),
  ReturnDesc: z.string(),
  eCollectUrl: z.string(),
  TicketId: z.string(),
});

export async function createTransactionPayment(donation: Donation, sessionToken: string) {
  const body_raw = JSON.stringify({
      EntityCode: process.env.ECOLLECT_ENTITY_CODE,
      SessionToken: sessionToken,
      SrvCode: '1029',
      TransValue: donation.amount,
      URLRedirect: `${process.env.NEXT_PUBLIC_BASE_URL}/results/${donation.reference}`,
      URLResponse: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/ecollect`,
      referenceArray: [
        donation.id_type,                                // [0] Tipo de documento
        donation.id_number,                              // [1] Número de identificación
        donation.reference,                              // [2] ID de transacción interno
        `${donation.firstName} ${donation.lastName}`,  // [3] Nombre completo
        donation.email,                                  // [4] Correo
        donation.phone,                                 // [5] Teléfono/Celular
        donation.destination,                            // [6] (opcional) destinación
        donation.address,                                // [7] (opcional) dirección
      ],
    })

  console.log("CREATE TRANSACTION PAYMENT BODY ==> ", donation);
  const response = await fetch(`${process.env.ECOLLECT_API_URL}/createTransactionPayment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body_raw 
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('eCollect createTransactionPayment failed:', errorBody);
    throw new Error(`Failed to create transaction payment with eCollect: ${errorBody}`);
  }

  const data = await response.json();
  const parsedData = createTransactionPaymentSchema.safeParse(data);
  console.log("PARSED DATA ==> ", data);
  if (!parsedData.success) {
    console.error('Invalid create transaction payment response from eCollect:', parsedData.error);
    throw new Error('Invalid create transaction payment response from eCollect');
  }
  console.log('eCollect createTransactionPayment response:', parsedData.data.eCollectUrl);
  return parsedData.data;
}
