
import { NextRequest, NextResponse } from 'next/server';
import { donationRepository } from '@/data/donations';
import { sendThankYouEmail } from '@/lib/email';
import { getTransactionInformation } from '@/infrastructure/services/ecollect/getTransactionInformation';

// Mapeo de estados de eCollect a estados internos
const statusMap: { [key: string]: 'approved' | 'rejected' | 'pending' } = {
  OK: 'approved',
  APPROVED: 'approved',
  DECLINED: 'rejected',
  REJECTED: 'rejected',
  PENDING: 'pending',
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('Webhook received from eCollect:', data);

    const { reference, ticket_id } = data;

    if (!reference || !ticket_id) {
      return NextResponse.json({ error: 'Missing reference or ticket_id' }, { status: 400 });
    }

    const transactionInfo = await getTransactionInformation(ticket_id);
    const eCollectStatus = transactionInfo.TranState;

    if (!eCollectStatus) {
      return NextResponse.json({ error: 'Missing status in transaction information' }, { status: 400 });
    }

    const internalStatus = statusMap[eCollectStatus.toUpperCase()];

    if (!internalStatus) {
      console.warn(`Unknown status received: ${eCollectStatus}`);
      await donationRepository.update(reference, { status: eCollectStatus.toLowerCase() });
      return NextResponse.json({ ok: true, message: 'Status processed as unknown' });
    }

    const updatedDonation = await donationRepository.update(reference, { status: internalStatus, ticket_id });

    if (!updatedDonation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    if (internalStatus === 'approved') {
      await sendThankYouEmail(
        updatedDonation.email,
        `${updatedDonation.firstName} ${updatedDonation.lastName}`,
        updatedDonation.amount
      );
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Error processing eCollect webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
