
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionToken, createTransactionPayment } from '@/infrastructure/services/ecollect';
import { donationRepository } from '@/data/donations';
import type { DonationDocument } from '@/domain/Donation';
import { getDb } from '@/lib/firebase/firebaseAdmin'; // Using the new safe initializer

const donationSchema = z.object({
    amount: z.number().min(10000),
    destination: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    id_type: z.string(),
    id_number: z.string(),
    country: z.string(),
    city: z.string(),
    address: z.string(),
    mobile: z.string(),
    affiliation: z.string(),
    terms_and_conditions: z.literal(true),
  });

export async function POST(request: Request) {
    console.log("Donation POST request received.");
    try {
        // Get the DB instance using the safe getter
        const db = getDb();
        console.log("Successfully obtained Firestore DB via getDb().");

        const body = await request.json();
        const validation = donationSchema.safeParse(body);

        if (!validation.success) {
            console.error("Invalid donation data:", validation.error.flatten());
            return NextResponse.json({ error: 'Invalid donation data', details: validation.error.flatten() }, { status: 400 });
        }
        console.log("Donation data validated successfully.");

        const reference = `DON-${Date.now()}`;
        console.log("Generated reference:", reference);
        const newDonation = {
            ...validation.data,
            reference,
            status: 'pending' as const,
        };
        console.log("New donation object:", newDonation);
        const createdDonation = await donationRepository.create(newDonation);
        console.log("Created donation:", createdDonation);

        try {
            console.log("Getting eCollect session token...");
            const { SessionToken } = await getSessionToken();
            console.log("eCollect transaction payment created.");
            const { eCollectUrl, TicketId } = await createTransactionPayment(createdDonation, SessionToken);

            await donationRepository.update(reference, { ticket_id: TicketId, payment_url: eCollectUrl, status: 'processing' });

            console.log("Returning payment URL to client.", eCollectUrl);
            return NextResponse.json({ ok: true, paymentUrl: eCollectUrl, reference });
        } catch (eCollectError) {
            console.error("eCollect processing failed:", eCollectError);
            const errorMessage = eCollectError instanceof Error ? eCollectError.message : 'Unknown eCollect error';
            await donationRepository.update(reference, { status: 'error', error_message: errorMessage });
            return NextResponse.json({ error: 'Failed to process payment', details: errorMessage }, { status: 500 });
        }

    } catch (error: any) {
        console.error('Donation processing failed:', error);
        let errorMessage = error.message || 'Unknown error';
         if (error.message.includes('Firebase Admin SDK initialization failed')) {
            errorMessage = 'Could not connect to Firebase services. Please check server configuration.';
        }
        return NextResponse.json({ error: 'Failed to process donation', details: errorMessage }, { status: 500 });
    }
}
