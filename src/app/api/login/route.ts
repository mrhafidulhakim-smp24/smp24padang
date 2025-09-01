import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email dan password wajib diisi.' },
                { status: 400 },
            );
        }

        const user = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Email atau password salah.' },
                { status: 401 },
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Login berhasil.',
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan tak terduga.' },
            { status: 500 },
        );
    }
}
