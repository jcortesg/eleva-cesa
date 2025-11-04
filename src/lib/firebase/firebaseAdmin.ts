import admin from 'firebase-admin';

/**
 * Ensures that the Firebase Admin SDK is initialized, but only once.
 * This function is the single source of truth for getting the admin instance.
 * @returns The initialized Firebase Admin app instance.
 */
export function getFirebaseAdmin() {
  // If an app is already initialized, return admin immediately.
  if (admin.apps.length > 0 && admin.apps[0]) {
    return admin;
  }

  try {
    console.log('Attempting to initialize Firebase Admin SDK...');

    // Try to get credentials from environment variable
    const serviceAccountKey = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

    if (!serviceAccountKey) {
      throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set');
    }

    const serviceAccount = JSON.parse(serviceAccountKey);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });

    console.log('Firebase Admin SDK initialized successfully.');
    return admin;

  } catch (error: any) {
    // Log the detailed error to the server console.
    console.error('!!! FIREBASE ADMIN SDK INITIALIZATION FAILED !!!', error);
    // Re-throw the error to ensure consuming services know about the failure.
    throw new Error(`Firebase Admin SDK initialization failed: ${error.message}`);
  }
}

/**
 * A simple getter for the Firestore database instance.
 * It relies on getFirebaseAdmin to ensure the SDK is ready.
 */
export function getDb() {
  // This will ensure the app is initialized before returning the db instance.
  getFirebaseAdmin();
  return admin.firestore();
}
