import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email and password are required.' },
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
                { success: false, message: 'Invalid credentials.' },
                { status: 401 },
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Login successful.',
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: 'Invalid credentials.' },
            { status: 401 },
        );
    }
}
