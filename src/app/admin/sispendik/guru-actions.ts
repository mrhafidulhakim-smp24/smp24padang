
'use server';

import { db } from '@/lib/db';
import { guruSispendik } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const GuruSchema = z.object({
    namaGuru: z.string().min(3, 'Nama guru minimal 3 karakter'),
});

export type State = {
    errors?: {
        namaGuru?: string[];
    };
    message?: string | null;
    success: boolean;
};

export async function createGuru(prevState: State, formData: FormData): Promise<State> {
    const validatedFields = GuruSchema.safeParse({
        namaGuru: formData.get('namaGuru'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Gagal membuat guru. Mohon periksa isian Anda.',
            success: false,
        };
    }

    try {
        await db.insert(guruSispendik).values({
            namaGuru: validatedFields.data.namaGuru,
        });
        revalidatePath('/admin/sispendik');
        return { message: 'Guru berhasil ditambahkan.', success: true };
    } catch (error) {
        return { message: 'Gagal menambahkan guru.', success: false };
    }
}

export async function updateGuru(
    id: number,
    prevState: State,
    formData: FormData,
): Promise<State> {
    const validatedFields = GuruSchema.safeParse({
        namaGuru: formData.get('namaGuru'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Gagal memperbarui guru. Mohon periksa isian Anda.',
            success: false,
        };
    }

    try {
        await db
            .update(guruSispendik)
            .set({
                namaGuru: validatedFields.data.namaGuru,
                updatedAt: new Date(),
            })
            .where(eq(guruSispendik.id, id));
        revalidatePath('/admin/sispendik');
        return { message: 'Guru berhasil diperbarui.', success: true };
    } catch (error) {
        return { message: 'Gagal memperbarui guru.', success: false };
    }
}

export async function deleteGuru(id: number): Promise<{ success: boolean, message: string }> {
    try {
        await db.delete(guruSispendik).where(eq(guruSispendik.id, id));
        revalidatePath('/admin/sispendik');
        return { success: true, message: 'Guru berhasil dihapus.' };
    } catch (error) {
        return { success: false, message: 'Gagal menghapus guru.' };
    }
}
