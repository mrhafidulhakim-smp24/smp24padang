import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email dan password diperlukan.' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'Pengguna dengan email ini sudah terdaftar.' },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.insert(users).values({
            id: `user_${Date.now()}`,
            email: email,
            password: hashedPassword,
            name: email.split('@')[0], // Default name from email
        });

        console.log(`New user registered: ${email}`);

        return NextResponse.json(
            { message: 'Pendaftaran berhasil.' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error during user registration:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan server.' },
            { status: 500 }
        );
    }
}
