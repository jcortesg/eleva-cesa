
import { NextResponse } from 'next/server';
import { getTransactionInformation } from '@/infrastructure/services/ecollect';
import { db } from '@/lib/firebase/firebaseAdmin';

export async function GET(request: Request, { params }: { params: { reference: string } }) {
  const reference = params.reference;
  console.log("Donation GET request received.", reference);

  try {
    const donationsRef = db.collection('donations');
    const snapshot = await donationsRef.where('reference', '==', reference).get();

    if (snapshot.empty) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    const doc = snapshot.docs[0];
    const donation = doc.data();

    if (!donation.ticket_id) {
        return NextResponse.json({ error: 'Payment ID not found for this donation' }, { status: 400 });
    }


    const transactionInfo = await getTransactionInformation(donation.ticket_id);
    const payment = transactionInfo.PaymentsArray?.[0] ?? {};
    await doc.ref.update({
      status: transactionInfo.TranState,                     // CREATED, APPROVED, etc.
      approvalCode: payment.TrazabilityCode || "",        // código de aprobación
      paymentMethod: payment.FIName || "",                // banco o sistema
      transactionDate: transactionInfo.BankProcessDate || "",// fecha del proceso
      transactionId: transactionInfo.TicketId || "",         // id de la transacción
      response: payment.RespMessage || transactionInfo.ReturnCode, // mensaje de respuesta
    });

    return NextResponse.json(transactionInfo);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
