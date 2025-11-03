'use server';

import { getUsers as getUsersFromFirestore } from '@/lib/firebase/firebase-admin';

// The getUsers function can remain as is if it's working, but if it also fails,
// it should be refactored to call an API route as well.
export async function getUsers() {
  return await getUsersFromFirestore();
}

/**
 * This server action now delegates user creation to a dedicated API route.
 * This avoids Firebase Admin SDK initialization issues within server actions.
 */
export async function createUser(formData: FormData) {
  // We still construct the object from FormData on the server
  const userData = {
    displayName: formData.get('displayName') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  console.log('Server Action: Delegating user creation to /api/users');

  try {
    // IMPORTANT: We need the full, absolute URL for the fetch request on the server.
    // Vercel and other platforms provide this, or it should be in an environment variable.
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000'; // Fallback for local development

    const response = await fetch(`${baseUrl}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!response.ok) {
      // The API route now provides a clear error message.
      console.error('API route returned an error:', result.error);
      return { error: result.error || 'Failed to create user' };
    }

    console.log('User created successfully via API route.');
    return { success: true };

  } catch (error: any) {
    console.error('--- UNEXPECTED ERROR IN SERVER ACTION ---', error);
    return { error: 'An unexpected error occurred while contacting the creation service.' };
  }
}
