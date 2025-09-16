
import { NextResponse } from 'next/server';
import { getTransactionInformation } from '@/infrastructure/services/ecollect';
import { db } from '@/lib/firebase/firebaseAdmin';

export async function GET(request: Request, { params }: { params: { reference: string } }) {
  const reference = params.reference;

  try {
    const donationsRef = db.collection('donations');
    const snapshot = await donationsRef.where('reference', '==', reference).get();

    if (snapshot.empty) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    const doc = snapshot.docs[0];
    const donation = doc.data();

    if (!donation.payment_id) {
        return NextResponse.json({ error: 'Payment ID not found for this donation' }, { status: 400 });
    }

    const transactionInfo = await getTransactionInformation(donation.payment_id);

    await doc.ref.update({
      status: transactionInfo.response,
      approvalCode: transactionInfo.approvalCode,
      paymentMethod: transactionInfo.paymentMethod,
      transactionDate: transactionInfo.transactionDate,
      transactionId: transactionInfo.transactionId,
    });

    return NextResponse.json(transactionInfo);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
