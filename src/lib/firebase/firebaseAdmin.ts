import admin from 'firebase-admin';
import serviceAccount from "../../../serviceAccountKey.json";

// This function ensures Firebase is initialized only once.
function initializeFirebaseAdmin() {
    if (admin.apps.length > 0) {
        console.log("Firebase admin app already initialized.");
        return admin.app();
    }

    console.log("Initializing Firebase Admin SDK...");

    try {
        const app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        });
        console.log("Firebase Admin SDK initialized successfully.");
        return app;
    } catch (error) {
        console.log(serviceAccount);
        console.error("Error initializing Firebase Admin SDK:", error);
        // We re-throw the error to ensure the application doesn't proceed
        // with a non-functional Firebase setup.
        throw new Error("Could not initialize Firebase Admin SDK. Please check the FIREBASE_SERVICE_ACCOUNT_KEY environment variable.");
    }
}

// Initialize the app.
initializeFirebaseAdmin();

// Export the Firestore database instance.
const db = admin.firestore();
console.log("Firestore instance created.");

export { db };
