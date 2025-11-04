import type { DonationDocument, CreateDonationDTO } from '@/domain/Donation';
import { getDb } from '@/lib/firebase/firebaseAdmin';

const DONATIONS_COLLECTION = 'donations';

export const donationRepository = {
  create: async (donation: CreateDonationDTO): Promise<DonationDocument> => {
    const db = getDb();
    const newDonation: DonationDocument = {
      ...donation,
      created_at: new Date(),
      updated_at: new Date()
    };

    await db.collection(DONATIONS_COLLECTION).add(newDonation);

    return newDonation;
  },

  getByReference: async (reference: string): Promise<DonationDocument | undefined> => {
    const db = getDb();
    const snapshot = await db.collection(DONATIONS_COLLECTION).where('reference', '==', reference).limit(1).get();

    if (snapshot.empty) {
      return undefined;
    }

    return snapshot.docs[0].data() as DonationDocument;
  },

  update: async (reference: string, updates: Partial<DonationDocument>): Promise<DonationDocument | undefined> => {
    const db = getDb();
    const snapshot = await db.collection(DONATIONS_COLLECTION).where('reference', '==', reference).limit(1).get();

    if (snapshot.empty) {
      return undefined;
    }

    const doc = snapshot.docs[0];
    const updatedData = { ...updates, updated_at: new Date() };
    await doc.ref.update(updatedData);

    const updatedDoc = await doc.ref.get();
    return updatedDoc.data() as DonationDocument;
  },
};
