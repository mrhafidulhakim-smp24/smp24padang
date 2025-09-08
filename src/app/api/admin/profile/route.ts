import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'User not authenticated.' }, { status: 401 });
  }

  const userId = session.user.id;
  const userProfile = await db.select({
    name: users.name,
    email: users.email,
  }).from(users).where(eq(users.id, userId)).limit(1);

  if (!userProfile || userProfile.length === 0) {
    return NextResponse.json({ error: 'User profile not found.' }, { status: 404 });
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return NextResponse.json({ profile: userProfile[0] });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: 'User not authenticated.' }, { status: 401 });
  }

  const userId = session.user.id;
  const { name, email } = await request.json();

  if (!name || name.trim() === '') {
    return NextResponse.json({ success: false, message: 'Username tidak boleh kosong.' }, { status: 400 });
  }
  if (!email || !email.includes('@')) {
    return NextResponse.json({ success: false, message: 'Email tidak valid.' }, { status: 400 });
  }

  const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  if (!existingUser || existingUser.length === 0) {
    return NextResponse.json({ success: false, message: 'User profile not found.' }, { status: 404 });
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  await db.update(users).set({ name: name, email: email }).where(eq(users.id, userId));

  return NextResponse.json({ success: true, message: 'Profil berhasil diperbarui!' });
}
