import { firestore } from './admin-instance';

/**
 * A simplified user type that is safe to use on the client-side.
 */
export interface AppUser {
  uid: string;
  email?: string;
  displayName?: string;
}

/**
 * Fetches users from the Firestore 'users' collection.
 * If a searchQuery is provided, it filters users by displayName or email.
 * @param {string} [searchQuery] - An optional search term.
 * @returns {Promise<AppUser[]>} A promise that resolves to an array of users.
 */
export const getUsers = async (searchQuery?: string): Promise<AppUser[]> => {
  try {
    const usersSnapshot = await firestore.collection('users').get();
    if (usersSnapshot.empty) {
      return [];
    }

    let users = usersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        uid: doc.id,
        email: data.email || undefined,
        displayName: data.nombre || undefined, // The field in Firestore is 'nombre'
      };
    });

    // Filter users if a search query is provided
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      users = users.filter((user) => {
        const nameMatch = user.displayName?.toLowerCase().includes(lowercasedQuery);
        const emailMatch = user.email?.toLowerCase().includes(lowercasedQuery);
        return nameMatch || emailMatch;
      });
    }

    return users;
  } catch (error: any) {
    console.error(
      'Error fetching users from Firestore (getUsers):',
      `Message: ${error.message}`
    );
    return [];
  }
};

/**
 * Gets the total number of users from the 'users' collection.
 * @returns A promise that resolves to the number of users.
 */
export const getTotalUsers = async (): Promise<number> => {
  try {
    const usersQuery = firestore.collection('users');
    const snapshot = await usersQuery.count().get();
    return snapshot.data().count;
  } catch (error: any) {
    console.error(
      'Error counting users in Firestore (getTotalUsers):',
      `Message: ${error.message}`
    );
    return 0;
  }
};
