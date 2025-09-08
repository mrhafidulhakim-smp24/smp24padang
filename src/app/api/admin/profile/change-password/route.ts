import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: 'User not authenticated.' }, { status: 401 });
  }

  const userId = session.user.id;
  const { oldPassword, newPassword } = await request.json();

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  if (!user || user.length === 0) {
    return NextResponse.json({ success: false, message: 'User profile not found.' }, { status: 404 });
  }

  const userProfile = user[0];

  // Compare old password with hashed password in the database
  const isPasswordValid = await bcrypt.compare(oldPassword, userProfile.password);

  if (!isPasswordValid) {
    return NextResponse.json({ success: false, message: 'Password lama salah.' }, { status: 400 });
  }

  if (newPassword.length < 8) {
    return NextResponse.json({ success: false, message: 'Password baru minimal 8 karakter.' }, { status: 400 });
  }
  if (newPassword === oldPassword) {
    return NextResponse.json({ success: false, message: 'Password baru tidak boleh sama dengan password lama.' }, { status: 400 });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10); // Salt rounds: 10

  // Update the user's password in the database
  await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId));

  return NextResponse.json({ success: true, message: 'Password berhasil diubah!' });
}
