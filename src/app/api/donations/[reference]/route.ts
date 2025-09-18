import { NextResponse } from 'next/server';
import { getTransactionInformation } from '@/infrastructure/services/ecollect';
import { db } from '@/lib/firebase/firebaseAdmin';

export async function GET(request: Request, { params }: { params: { reference: string } }) {
  const reference = params.reference;

  try {
    const donationsRef = db.collection('donations');
    const snapshot = await donationsRef.where('reference', '==', reference).limit(1).get();

    if (snapshot.empty) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    const doc = snapshot.docs[0];
    let donation = doc.data();

    // Solo consultar a eCollect si el estado está pendiente para ser más eficientes
    if (donation.status === 'pending' && donation.ticket_id) {
      const transactionInfo = await getTransactionInformation(donation.ticket_id);
      const payment = transactionInfo.PaymentsArray?.[0] ?? {};
      
      const updates = {
        status: transactionInfo.TranState?.toLowerCase() || 'pending',
        approvalCode: payment.TrazabilityCode || "",
        paymentMethod: payment.FIName || "",
        transactionDate: transactionInfo.BankProcessDate || "",
        response: payment.RespMessage || transactionInfo.ReturnCode,
      };

      await doc.ref.update(updates);
      // Combinar los datos actualizados con el objeto de donación original
      donation = { ...donation, ...updates };
    }

    // Devolver el objeto de la donación completo y actualizado
    return NextResponse.json(donation);
  } catch (error) {
    console.error(`Error processing donation ${reference}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
