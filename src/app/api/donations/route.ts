import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionToken, createTransactionPayment } from '@/infrastructure/services/ecollect';
import { donationRepository } from '@/data/donations';
import type { Donation } from '@/domain/Donation';
import { db } from '@/lib/firebase/firebaseAdmin';

const donationSchema = z.object({
    amount: z.number().min(10000),
    destination: z.string(),
    joint_donation: z.boolean().optional(),
    pledge_payment: z.boolean().optional(),
    employer_match: z.boolean().optional(),
    title: z.string().optional(),
    first_name: z.string(),
    last_name: z.string(),
    graduation_year: z.string().optional(),
    school: z.string().optional(),
    email: z.string().email(),
    id_type: z.string(),
    id_number: z.string(),
    country: z.string(),
    city: z.string(),
    address: z.string(),
    mobile: z.string(),
    phone: z.string().optional(),
    affiliation: z.string(),
    comments: z.string().optional(),
    terms_and_conditions: z.literal(true),
  });

export async function POST(request: Request) {
    console.log("Donation POST request received.");
    try {
        const body = await request.json();
        console.log("Request body:", body);

        const validation = donationSchema.safeParse(body);

        if (!validation.success) {
            console.error("Invalid donation data:", validation.error.flatten());
            return NextResponse.json({ error: 'Invalid donation data', details: validation.error.flatten() }, { status: 400 });
        }
        console.log("Donation data validated successfully.");

        const serverDonationRepository = {
            ...donationRepository,
            create: async (donation: Donation) => {
                try {
                    console.log("Creating donation in Firestore...");
                    const docRef = await db.collection('donations').add(donation);
                    console.log("Donation created with ID:", docRef.id);
                    return { ...donation, id: docRef.id };
                } catch (error) {
                    console.error("Error creating donation in Firestore:", error);
                    throw error;
                }
            },
            update: async (reference: string, data: Partial<Donation>) => {
                try {
                    console.log(`Updating donation with reference: ${reference}`);
                    const snapshot = await db.collection('donations').where('reference', '==', reference).get();
                    if (snapshot.empty) {
                        throw new Error('Donation not found');
                    }
                    const doc = snapshot.docs[0];
                    await doc.ref.update(data);
                    console.log(`Donation ${doc.id} updated successfully.`);
                } catch (error) {
                    console.error(`Error updating donation with reference ${reference}:`, error);
                    throw error;
                }
            }
        };

        const reference = `DON-${Date.now()}`;
        const newDonation: Donation = {
            ...validation.data,
            reference,
            status: 'pending',
        };
        await serverDonationRepository.create(newDonation);

        try {
            console.log("Getting eCollect session token...");
            const { SessionToken } = await getSessionToken();
            console.log("eCollect session token obtained.");

            console.log("Creating eCollect transaction payment...");
            const { PaymentURL, PaymentId } = await createTransactionPayment(newDonation, SessionToken);
            console.log("eCollect transaction payment created.");

            await serverDonationRepository.update(reference, { payment_id: PaymentId, payment_url: PaymentURL, status: 'processing' });

            console.log("Returning payment URL to client.");
            return NextResponse.json({ ok: true, paymentUrl: PaymentURL });
        } catch (eCollectError) {
            console.error("eCollect processing failed:", eCollectError);
            const errorMessage = eCollectError instanceof Error ? eCollectError.message : 'Unknown eCollect error';
            await serverDonationRepository.update(reference, { status: 'error', error_message: errorMessage });
            return NextResponse.json({ error: 'Failed to process payment', details: errorMessage }, { status: 500 });
        }

    } catch (error) {
        console.error('Donation processing failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: 'Failed to process donation', details: errorMessage }, { status: 500 });
    }
}
