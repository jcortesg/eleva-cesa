import admin from 'firebase-admin';

// A flag to ensure initialization only happens once.
let isInitialized = false;

console.log('Firebase Admin module loaded.');

/**
 * Ensures that the Firebase Admin SDK is initialized, but only once.
 * This function is the single source of truth for getting the admin instance.
 * @returns The initialized Firebase Admin app instance.
 */
export function getFirebaseAdmin() {
  if (isInitialized) {
    return admin;
  }

  try {
    console.log('Attempting to initialize Firebase Admin SDK...');

    // In the Firebase Studio environment, initializeApp() should automatically
    // find the project credentials without any arguments.
    admin.initializeApp();

    console.log('Firebase Admin SDK initialized successfully.');
    isInitialized = true;
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
