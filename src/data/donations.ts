import type { Donation, CreateDonationDTO } from '@/domain/Donation';
import { db } from '@/lib/firebase/firebaseAdmin';

const DONATIONS_COLLECTION = 'donations';

export const donationRepository = {
  create: async (donation: CreateDonationDTO): Promise<Donation> => {
    const newDonation: Donation = { 
      ...donation, 
      id: donation.reference, 
      created_at: new Date(), 
      updated_at: new Date() 
    };

    const docRef = db.collection(DONATIONS_COLLECTION).doc(newDonation.id);
    await docRef.set(newDonation);
    
    return newDonation;
  },
  
  getByReference: async (reference: string): Promise<Donation | undefined> => {
    const docRef = db.collection(DONATIONS_COLLECTION).doc(reference);
    const doc = await docRef.get();

    if (!doc.exists) {
      return undefined;
    }

    return doc.data() as Donation;
  },

  update: async (reference: string, updates: Partial<Donation>): Promise<Donation | undefined> => {
    const docRef = db.collection(DONATIONS_COLLECTION).doc(reference);
    const doc = await docRef.get();

    if (!doc.exists) {
      return undefined;
    }

    const updatedData = { ...updates, updated_at: new Date() };
    await docRef.update(updatedData);

    const updatedDoc = await docRef.get();
    return updatedDoc.data() as Donation;
  },
};
