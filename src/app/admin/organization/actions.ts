'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { organizationStructures } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { put, del } from '@vercel/blob';
import { z } from 'zod';

const structureSchema = z.object({
    title: z.string().min(1, 'Judul tidak boleh kosong'),
    description: z.string().optional(),
    pdfUrl: z.string().optional(),
});

export async function getOrganizationStructures() {
    try {
        return await db.query.organizationStructures.findMany();
    } catch (error) {
        console.error('Error fetching organization structures:', error);
        return [];
    }
}

export async function updateOrganizationStructure(
    type: string,
    currentImageUrl: string | null, // This is now the old blob url to be deleted
    formData: FormData,
) {
    const validatedFields = structureSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        pdfUrl: formData.get('pdfUrl'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { title, description, pdfUrl } = validatedFields.data;

    // On update, delete the old image from blob storage if it exists.
    if (currentImageUrl) {
        try {
            await del(currentImageUrl);
        } catch (error) {
            console.error('Error deleting old image from blob storage:', error);
            // We can choose to continue even if deletion fails,
            // as the main goal is to update the DB.
        }
    }

    try {
        await db
            .update(organizationStructures)
            .set({
                title,
                description,
                pdfUrl: pdfUrl,
                updatedAt: new Date(),
            })
            .where(eq(organizationStructures.type, type));

        revalidatePath('/admin/organization');
        revalidatePath('/profile/organization-structure');

        return {
            success: true,
            message: 'Struktur organisasi berhasil diperbarui.',
        };
    } catch (error) {
        console.error('Error updating structure:', error);
        return { success: false, error: 'Gagal memperbarui data.' };
    }
}
