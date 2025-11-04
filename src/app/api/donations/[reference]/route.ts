import { NextResponse } from 'next/server';
import { getTransactionInformation } from '@/infrastructure/services/ecollect';
import { getDb } from '@/lib/firebase/firebaseAdmin';
import { sendThankYouEmail } from '@/lib/email';

type Ctx = { params: Promise<{ reference: string }> };

// Mapeo de estados de eCollect a estados internos
const statusMap: { [key: string]: 'approved' | 'rejected' | 'pending' } = {
  OK: 'approved',
  APPROVED: 'approved',
  DECLINED: 'rejected',
  REJECTED: 'rejected',
  PENDING: 'pending',
};

export async function GET(request: Request, { params }: Ctx) {
  const { reference } = await params;

  try {
    const db = getDb();
    const donationsRef = db.collection('donations');
    const snapshot = await donationsRef.where('reference', '==', reference).limit(1).get();

    if (snapshot.empty) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    const doc = snapshot.docs[0];
    let donation = doc.data();
    const previousStatus = donation.status;

    console.log(`[${reference}] Current status in DB: ${previousStatus}`);

    // Solo consultar a eCollect si el estado no es final (approved/rejected)
    const shouldQueryEcollect = donation.ticket_id && !['approved', 'rejected'].includes(donation.status);
    console.log(`[${reference}] Should query eCollect: ${shouldQueryEcollect} (ticket_id: ${donation.ticket_id}, status: ${donation.status})`);

    if (shouldQueryEcollect) {
      console.log(`[${reference}] Querying eCollect for ticket: ${donation.ticket_id}`);
      const transactionInfo = await getTransactionInformation(donation.ticket_id);
      const payment = transactionInfo.PaymentsArray?.[0] ?? {};
      const eCollectStatus = transactionInfo.TranState;

      console.log(`[${reference}] eCollect status: ${eCollectStatus}`);

      // Map eCollect status to internal status
      const internalStatus = eCollectStatus ? statusMap[eCollectStatus.toUpperCase()] : undefined;

      console.log(`[${reference}] Mapped internal status: ${internalStatus}`);

      const updates: any = {
        status: internalStatus || eCollectStatus?.toLowerCase() || 'pending',
        approvalCode: payment.TrazabilityCode || "",
        paymentMethod: payment.FIName || "",
        transactionDate: transactionInfo.BankProcessDate || "",
        response: payment.RespMessage || transactionInfo.ReturnCode,
      };

      console.log(`[${reference}] Updating donation in Firestore with status: ${updates.status}`);
      await doc.ref.update(updates);
      // Combinar los datos actualizados con el objeto de donación original
      donation = { ...donation, ...updates };

      // Send thank you email only when status changes to approved
      console.log(`[${reference}] Email check - internalStatus: ${internalStatus}, previousStatus: ${previousStatus}`);
      console.log(`[${reference}] Condition check: internalStatus === 'approved' && previousStatus !== 'approved' => ${internalStatus === 'approved' && previousStatus !== 'approved'}`);

      if (internalStatus === 'approved' && previousStatus !== 'approved') {
        console.log(`[${reference}] 📧 SENDING EMAIL - Status changed to approved, sending thank you email to:`, donation.email);
        try {
          console.log(`[${reference}] Calling sendThankYouEmail with:`, {
            email: donation.email,
            name: `${donation.first_name} ${donation.last_name}`,
            amount: donation.amount
          });

          await sendThankYouEmail(
            donation.email,
            `${donation.first_name} ${donation.last_name}`,
            donation.amount
          );

          console.log(`[${reference}] ✅ Thank you email sent successfully`);
        } catch (emailError) {
          console.error(`[${reference}] ❌ Error sending thank you email:`, emailError);
          // Don't fail the request if email fails
        }
      } else {
        console.log(`[${reference}] ⏭️  SKIPPING EMAIL - Status not approved or already was approved. Previous: ${previousStatus}, Current: ${internalStatus}`);
      }
    } else {
      console.log(`[${reference}] Not querying eCollect - status: ${donation.status}, ticket_id: ${donation.ticket_id || 'none'}`);
    }

    // Devolver el objeto de la donación completo y actualizado
    console.log(`[${reference}] Returning donation with final status: ${donation.status}`);
    return NextResponse.json(donation);
  } catch (error) {
    console.error(`[${reference}] ❌ Error processing donation:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
