'use server';

import { db } from '@/lib/db';
import { accreditations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@/lib/auth';

export async function createAccreditation(data: {
    title: string;
    description: string;
    link: string;
}) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'Tidak terautentikasi.' };
    }

    try {
        await db.insert(accreditations).values({
            id: uuidv4(),
            ...data,
        });

        revalidatePath('/admin/accreditation');
        revalidatePath('/profile/accreditation');

        return { success: true, message: 'Akreditasi berhasil ditambahkan.' };
    } catch (error) {
        console.error('Error creating accreditation:', error);
        return { success: false, message: 'Gagal menambahkan akreditasi.' };
    }
}

export async function updateAccreditation(
    id: string,
    data: { title: string; description: string; link: string },
) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'Tidak terautentikasi.' };
    }

    try {
        await db
            .update(accreditations)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(accreditations.id, id));

        revalidatePath('/admin/accreditation');
        revalidatePath('/profile/accreditation');

        return { success: true, message: 'Akreditasi berhasil diperbarui.' };
    } catch (error) {
        console.error('Error updating accreditation:', error);
        return { success: false, message: 'Gagal memperbarui akreditasi.' };
    }
}

export async function deleteAccreditation(id: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'Tidak terautentikasi.' };
    }

    try {
        await db.delete(accreditations).where(eq(accreditations.id, id));

        revalidatePath('/admin/accreditation');
        revalidatePath('/profile/accreditation');

        return { success: true, message: 'Akreditasi berhasil dihapus.' };
    } catch (error) {
        console.error('Error deleting accreditation:', error);
        return { success: false, message: 'Gagal menghapus akreditasi.' };
    }
}
