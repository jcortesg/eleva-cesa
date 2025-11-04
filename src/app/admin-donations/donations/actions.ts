'use server';

import { firestore } from '@/lib/firebase/admin-instance';
import { Donation } from '@/domain/Donation';
import { Timestamp } from 'firebase-admin/firestore';

export async function getDonations(page: number = 1, pageSize: number = 10): Promise<{ donations: Donation[], total: number }> {
  const offset = (page - 1) * pageSize;

  // Get total count
  const totalSnapshot = await firestore.collection('donations').count().get();
  const total = totalSnapshot.data().count;

  // Get paginated data, ordered by created_at descending
  const snapshot = await firestore
    .collection('donations')
    .orderBy('created_at', 'desc')
    .limit(pageSize)
    .offset(offset)
    .get();

  const donations = snapshot.docs.map(doc => {
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
      donationSupport: data.donation_support,
      errorMessage: data.error_message,
    };
  });

  return { donations, total };
}

export async function getAllDonations(): Promise<Donation[]> {
  // Get all donations without pagination
  const snapshot = await firestore
    .collection('donations')
    .orderBy('created_at', 'desc')
    .get();

  const donations = snapshot.docs.map(doc => {
    const data = doc.data();

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
      donationSupport: data.donation_support,
      errorMessage: data.error_message,
    };
  });

  return donations;
}
