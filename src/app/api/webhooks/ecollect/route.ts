
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
    console.log('🔔 ============ WEBHOOK RECEIVED FROM ECOLLECT ============');
    console.log('📦 Webhook payload:', JSON.stringify(data, null, 2));

    const { reference, ticket_id } = data;

    if (!reference || !ticket_id) {
      console.error('❌ Missing reference or ticket_id in webhook');
      return NextResponse.json({ error: 'Missing reference or ticket_id' }, { status: 400 });
    }

    console.log(`[WEBHOOK ${reference}] Processing donation with ticket: ${ticket_id}`);

    const transactionInfo = await getTransactionInformation(ticket_id);
    console.log(`[WEBHOOK ${reference}] Transaction info from eCollect:`, JSON.stringify(transactionInfo, null, 2));

    const eCollectStatus = transactionInfo.TranState;
    console.log(`[WEBHOOK ${reference}] eCollect status: ${eCollectStatus}`);

    if (!eCollectStatus) {
      console.error(`[WEBHOOK ${reference}] ❌ Missing status in transaction information`);
      return NextResponse.json({ error: 'Missing status in transaction information' }, { status: 400 });
    }

    const internalStatus = statusMap[eCollectStatus.toUpperCase()];
    console.log(`[WEBHOOK ${reference}] Mapped internal status: ${internalStatus}`);

    if (!internalStatus) {
      console.warn(`[WEBHOOK ${reference}] ⚠️  Unknown status received: ${eCollectStatus}`);
      await donationRepository.update(reference, { status: eCollectStatus.toLowerCase() });
      return NextResponse.json({ ok: true, message: 'Status processed as unknown' });
    }

    console.log(`[WEBHOOK ${reference}] Updating donation in DB with status: ${internalStatus}`);
    const updatedDonation = await donationRepository.update(reference, { status: internalStatus, ticket_id });

    if (!updatedDonation) {
      console.error(`[WEBHOOK ${reference}] ❌ Donation not found in DB`);
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    console.log(`[WEBHOOK ${reference}] Donation updated successfully`);

    // Send thank you email only when donation is approved
    console.log(`[WEBHOOK ${reference}] Email check - internalStatus: ${internalStatus}`);
    console.log(`[WEBHOOK ${reference}] Condition check: internalStatus === 'approved' => ${internalStatus === 'approved'}`);

    if (internalStatus === 'approved') {
      console.log(`[WEBHOOK ${reference}] 📧 SENDING EMAIL - Donation approved, sending thank you email to: ${updatedDonation.email}`);

      try {
        await sendThankYouEmail(
          updatedDonation.email,
          `${updatedDonation.first_name} ${updatedDonation.last_name}`,
          updatedDonation.amount
        );
        console.log(`[WEBHOOK ${reference}] ✅ Thank you email sent successfully`);
      } catch (emailError) {
        console.error(`[WEBHOOK ${reference}] ❌ Error sending email:`, emailError);
        // Don't fail webhook if email fails
      }
    } else {
      console.log(`[WEBHOOK ${reference}] ⏭️  SKIPPING EMAIL - Status is not approved: ${internalStatus}`);
    }

    console.log(`[WEBHOOK ${reference}] ✅ Webhook processed successfully`);
    console.log('🔔 ============ WEBHOOK PROCESSING COMPLETE ============');
    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Error processing eCollect webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
