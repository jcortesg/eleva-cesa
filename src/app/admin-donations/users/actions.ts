'use server';

import { firestore } from '@/lib/firebase/admin-instance';
import { User } from '@/domain/User';
import { Timestamp } from 'firebase-admin/firestore';

export async function getUsers(page: number = 1, pageSize: number = 10): Promise<{ users: User[], total: number }> {
  const offset = (page - 1) * pageSize;

  // Get total count
  const totalSnapshot = await firestore.collection('users').count().get();
  const total = totalSnapshot.data().count;

  // Get paginated data, ordered by created_at descending
  const snapshot = await firestore
    .collection('users')
    .orderBy('created_at', 'desc')
    .limit(pageSize)
    .offset(offset)
    .get();

  const users = snapshot.docs.map(doc => {
    const data = doc.data();

    return {
      id: doc.id,
      email: data.email || '',
      displayName: data.nombre || data.display_name || '',
      createdAt: (data.created_at as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      updatedAt: (data.updated_at as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    };
  });

  return { users, total };
}

export async function createUser(formData: FormData) {
  const userData = {
    displayName: formData.get('displayName') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  console.log('Server Action: Delegating user creation to /api/users');

  try {
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!response.ok) {
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

export async function changePassword(userId: string, formData: FormData) {
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!newPassword || !confirmPassword) {
    return { error: 'Por favor complete todos los campos' };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'Las contraseñas no coinciden' };
  }

  if (newPassword.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres' };
  }

  console.log('Server Action: Delegating password change to /api/users/change-password');

  try {
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/users/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newPassword }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('API route returned an error:', result.error);
      return { error: result.error || 'Failed to change password' };
    }

    console.log('Password changed successfully via API route.');
    return { success: true };

  } catch (error: any) {
    console.error('--- UNEXPECTED ERROR IN SERVER ACTION ---', error);
    return { error: 'An unexpected error occurred while changing the password.' };
  }
}
