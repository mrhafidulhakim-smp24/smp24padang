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
    image: z.instanceof(File).optional(),
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
    currentImageUrl: string | null,
    formData: FormData,
) {
    const validatedFields = structureSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        image: formData.get('image'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { title, description, image } = validatedFields.data;

    let newImageUrl: string | undefined;

    if (image && image.size > 0) {
        try {
            if (currentImageUrl) {
                await del(currentImageUrl);
            }
            const blob = await put(image.name, image, { access: 'public' });
            newImageUrl = blob.url;
        } catch (error) {
            console.error('Error uploading image:', error);
            return { success: false, error: 'Gagal mengunggah gambar.' };
        }
    }

    try {
        await db
            .update(organizationStructures)
            .set({
                title,
                description,
                imageUrl: newImageUrl ?? currentImageUrl,
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
