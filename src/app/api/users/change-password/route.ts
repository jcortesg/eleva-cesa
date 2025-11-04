import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/firebase/admin-instance';

const changePasswordSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters long'),
});

export async function POST(request: Request) {
  console.log('POST /api/users/change-password request received.');
  try {
    const body = await request.json();
    const validation = changePasswordSchema.safeParse(body);

    if (!validation.success) {
      console.error('Invalid request data:', validation.error.flatten());
      return NextResponse.json({ error: 'Invalid request data', details: validation.error.flatten() }, { status: 400 });
    }

    const { userId, newPassword } = validation.data;

    console.log(`Attempting to change password for user: ${userId}`);

    await auth.updateUser(userId, {
      password: newPassword,
    });

    console.log(`Password updated successfully for user: ${userId}`);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('--- ERROR IN /api/users/change-password ---', error);
    let errorMessage = error.message || 'An unexpected error occurred.';
    let statusCode = 500;

    if (error.code === 'auth/user-not-found') {
      errorMessage = 'User not found.';
      statusCode = 404;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
