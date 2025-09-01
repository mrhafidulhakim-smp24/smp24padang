'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { uniforms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { put, del } from '@vercel/blob';
import { z } from 'zod';

const uniformUpdateSchema = z.object({
    description: z.string().min(1, 'Deskripsi tidak boleh kosong'),
    image: z.instanceof(File).optional(),
});

export async function updateUniform(id: number, formData: FormData) {
    const validatedFields = uniformUpdateSchema.safeParse({
        description: formData.get('description'),
        image: formData.get('image'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            message:
                'Validasi gagal: ' +
                validatedFields.error
                    .flatten()
                    .fieldErrors.description?.join(', '),
        };
    }

    const { description, image } = validatedFields.data;

    const existingUniform = await db.query.uniforms.findFirst({
        where: eq(uniforms.id, id),
    });

    if (!existingUniform) {
        return { success: false, message: 'Seragam tidak ditemukan.' };
    }

    let newImageUrl: string | undefined = undefined;

    if (image && image.size > 0) {
        try {
            if (existingUniform.image) {
                await del(existingUniform.image);
            }

            const blob = await put(image.name, image, { access: 'public' });
            newImageUrl = blob.url;
        } catch (error) {
            console.error('Error during image upload:', error);
            return { success: false, message: 'Gagal mengunggah gambar baru.' };
        }
    }

    try {
        await db
            .update(uniforms)
            .set({
                description,

                image: newImageUrl ?? existingUniform.image,
                updatedAt: new Date(),
            })
            .where(eq(uniforms.id, id));

        revalidatePath('/admin/profile/uniform');
        revalidatePath('/profile/uniform');

        return {
            success: true,
            message: 'Seragam berhasil diperbarui.',
            updatedImage: newImageUrl ?? existingUniform.image,
        };
    } catch (error) {
        console.error('Error updating uniform in DB:', error);
        return {
            success: false,
            message: 'Gagal memperbarui seragam di database.',
        };
    }
}
