import type { Donation } from '@/domain/Donation';

// In-memory store for donations (for demonstration purposes)
const donations: Map<string, Donation> = new Map();

export const donationRepository = {
  create: async (donation: Donation): Promise<Donation> => {
    const newDonation = { ...donation, id: donation.reference, created_at: new Date(), updated_at: new Date() };
    donations.set(newDonation.id, newDonation);
    return newDonation;
  },
  findByReference: async (reference: string): Promise<Donation | undefined> => {
    return donations.get(reference);
  },
  update: async (reference: string, updates: Partial<Donation>): Promise<Donation | undefined> => {
    const existingDonation = donations.get(reference);
    if (!existingDonation) {
      return undefined;
    }
    const updatedDonation = { ...existingDonation, ...updates, updated_at: new Date() };
    donations.set(reference, updatedDonation);
    return updatedDonation;
  },
};
