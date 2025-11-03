import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// This function gets or initializes the Firebase Admin app, ensuring it only happens once.
const getAdminApp = (): admin.app.App => {
  // If an app is already initialized, return it immediately.
  if (admin.apps.length > 0 && admin.apps[0]) {
    return admin.apps[0];
  }

  // If not initialized, create a new app.
  try {
    const serviceAccountString = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (!serviceAccountString) {
      throw new Error('CRITICAL: GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set.');
    }

    const serviceAccount = JSON.parse(serviceAccountString);

    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.error('CRITICAL: Failed to initialize Firebase Admin SDK:', error);
    throw new Error(`Firebase initialization failed: ${error.message}`);
  }
};

// Get the singleton app instance.
const adminApp = getAdminApp();

// Get the auth and firestore services from the singleton app instance.
const auth = getAuth(adminApp);
const firestore = getFirestore(adminApp);

// Export the initialized services and the admin namespace itself for utility functions like serverTimestamp
export { admin, auth, firestore };
