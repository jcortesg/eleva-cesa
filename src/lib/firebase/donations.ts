import { firestore } from './admin-instance';

// Define the structure of a Donation object
export interface Donation {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  createdAt: string;
}

/**
 * Fetches donations from the 'donations' collection in Firestore.
 * If a searchQuery is provided, it filters donations by the user's name.
 * @param {string} [searchQuery] - An optional search term.
 * @returns {Promise<Donation[]>} A promise that resolves to an array of Donation objects.
 */
export const getDonations = async (searchQuery?: string): Promise<Donation[]> => {
  try {
    const donationsSnapshot = await firestore.collection('donations').orderBy('createdAt', 'desc').get();
    if (donationsSnapshot.empty) {
      return [];
    }

    let donations = donationsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        userName: data.userName,
        amount: data.amount,
        currency: data.currency,
        createdAt: data.createdAt,
      };
    });

    // Filter donations if a search query is provided
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      donations = donations.filter((donation) => 
        donation.userName.toLowerCase().includes(lowercasedQuery)
      );
    }

    return donations;

  } catch (error: any) {
    console.error(
      'Error fetching donations from Firestore:',
      `Message: ${error.message}`
    );
    return [];
  }
};

/**
 * Gets the total number of donations from the 'donations' collection.
 * @returns A promise that resolves to the number of donations.
 */
export const getTotalDonations = async (): Promise<number> => {
  try {
    const donationsQuery = firestore.collection('donations');
    const snapshot = await donationsQuery.count().get();
    return snapshot.data().count;
  } catch (error: any) {
    console.error(
      'Error counting donations in Firestore (getTotalDonations):',
      `Message: ${error.message}`
    );
    return 0;
  }
};
