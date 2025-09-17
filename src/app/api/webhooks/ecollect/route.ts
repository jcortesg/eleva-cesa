
import { NextRequest, NextResponse } from 'next/server';
import { donationRepository } from '@/data/donations';
import { sendDonationConfirmationEmail } from '@/lib/email';

// Mapeo de estados de eCollect a estados internos
const statusMap: { [key: string]: 'approved' | 'rejected' | 'pending' } = {
  APPROVED: 'approved',
  DECLINED: 'rejected',
  REJECTED: 'rejected',
  PENDING: 'pending',
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('Webhook received from eCollect:', data);

    const { reference, status: eCollectStatus } = data;

    if (!reference || !eCollectStatus) {
      return NextResponse.json({ error: 'Missing reference or status' }, { status: 400 });
    }

    const internalStatus = statusMap[eCollectStatus.toUpperCase()];

    if (!internalStatus) {
      console.warn(`Unknown status received: ${eCollectStatus}`);
      // Aún así, intentamos actualizar con el estado original por si es relevante
      await donationRepository.update(reference, { status: eCollectStatus.toLowerCase() });
      return NextResponse.json({ ok: true, message: 'Status processed as unknown' });
    }

    const updatedDonation = await donationRepository.update(reference, { status: internalStatus });

    if (!updatedDonation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    // Si la donación es aprobada, enviamos el correo de confirmación
    if (internalStatus === 'approved') {
      await sendDonationConfirmationEmail(
        updatedDonation.email,
        updatedDonation.first_name,
        updatedDonation.amount,
        updatedDonation.reference
      );
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Error processing eCollect webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
