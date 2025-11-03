import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getFirebaseAdmin, getDb } from '@/lib/firebase/firebaseAdmin'; // Using the new safe initializers

const userSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export async function POST(request: Request) {
  console.log('POST /api/users request received.');
  try {
    // Initialize Firebase Admin and get services
    const admin = getFirebaseAdmin();
    const db = getDb();
    const auth = admin.auth();

    console.log('Successfully obtained Firebase services via getters.');

    const body = await request.json();
    const validation = userSchema.safeParse(body);

    if (!validation.success) {
      console.error('Invalid user data:', validation.error.flatten());
      return NextResponse.json({ error: 'Invalid user data', details: validation.error.flatten() }, { status: 400 });
    }

    const { email, password, displayName } = validation.data;

    console.log(`Attempting to create user in Firebase Auth: ${email}`);
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
    });

    console.log(`User created in Auth with UID: ${userRecord.uid}`);

    await db.collection('users').doc(userRecord.uid).set({
      displayName,
      email,
      createdAt: new Date(),
    });

    console.log('User data saved to Firestore.');

    return NextResponse.json({ success: true, uid: userRecord.uid });

  } catch (error: any) {
    console.error('--- ERROR IN /api/users ---', error);
    let errorMessage = error.message || 'An unexpected error occurred.';
    let statusCode = 500;

    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'The email address is already in use by another account.';
      statusCode = 409;
    } else if (error.message.includes('Firebase Admin SDK initialization failed')) {
      // This is our custom error from the initializer
      errorMessage = 'Could not connect to Firebase services. Please check server configuration.';
      statusCode = 503; // Service Unavailable
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
