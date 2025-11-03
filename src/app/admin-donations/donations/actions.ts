'use server';

import { firestore } from '@/lib/firebase/admin-instance';
import { Donation } from '@/domain/Donation';
import { Timestamp } from 'firebase-admin/firestore';

export async function getDonations(): Promise<Donation[]> {
  const snapshot = await firestore.collection('donations').get();
  
  return snapshot.docs.map(doc => {
    const data = doc.data();

    // It's crucial that the object returned to the client doesn't contain non-serializable
    // objects like Firestore Timestamps. We manually construct the object, converting
    // Timestamps to ISO strings and mapping from snake_case to camelCase.
    return {
      id: doc.id,
      address: data.address,
      affiliation: data.affiliation,
      amount: data.amount,
      city: data.city,
      comments: data.comments,
      country: data.country,
      createdAt: (data.created_at as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      destination: data.destination,
      email: data.email,
      firstName: data.first_name,
      idNumber: data.id_number,
      idType: data.id_type,
      lastName: data.last_name,
      mobile: data.mobile,
      paymentUrl: data.payment_url,
      reference: data.reference,
      status: data.status,
      termsAndConditions: data.terms_and_conditions,
      ticketId: data.ticket_id,
      updatedAt: (data.updated_at as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    };
  });
}
