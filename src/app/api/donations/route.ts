import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionToken, createTransactionPayment } from '@/infrastructure/services/ecollect';
import { donationRepository } from '@/data/donations';
import type { Donation } from '@/domain/Donation';
import { db } from '@/lib/firebase/firebaseAdmin'; // Use the admin database

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
    phone: z.string().optional(),
    affiliation: z.string(),
    comments: z.string().optional(),
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

        console.log("Getting eCollect session token...");
        const { SessionToken } = await getSessionToken();
        console.log("eCollect session token obtained.");

        const reference = `DON-${Date.now()}`;
        const newDonation: Donation = {
            ...validation.data,
            reference,
            status: 'pending',
        };
        await serverDonationRepository.create(newDonation);

        console.log("Creating eCollect transaction payment...");
        const { PaymentURL, PaymentId } = await createTransactionPayment(newDonation, SessionToken);
        console.log("eCollect transaction payment created.");

        await serverDonationRepository.update(reference, { payment_id: PaymentId, payment_url: PaymentURL });

        console.log("Returning payment URL to client.");
        return NextResponse.json({ ok: true, paymentUrl: PaymentURL });

    } catch (error) {
        console.error('Donation processing failed:', error);
        return NextResponse.json({ error: 'Failed to process donation', details: error.message }, { status: 500 });
    }
}
