'use server';

import { db } from '@/lib/db';
import { achievements } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { put, del } from '@vercel/blob';
import { revalidatePath, revalidateTag } from 'next/cache';
import { AchievementSchema } from './schema';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@/lib/auth';

export async function getAchievements() {
    try {
        return await db
            .select()
            .from(achievements)
            .orderBy(desc(achievements.createdAt));
    } catch (error) {
        console.error('Error fetching achievements:', error);
        return [];
    }
}

export async function createAchievement(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'Tidak terautentikasi.' };
    }

    const validatedFields = AchievementSchema.safeParse({
        title: formData.get('title'),
        student: formData.get('student'),
        description: formData.get('description'),
    });

    if (!validatedFields.success) {
        const errorMessages = Object.values(
            validatedFields.error.flatten().fieldErrors,
        )
            .flat()
            .join(', ');
        return { success: false, message: `Validasi gagal: ${errorMessages}` };
    }

    const { title, student, description } = validatedFields.data;
    const imageFile = formData.get('image') as File;
    let imageUrl = null;

    try {
        if (imageFile && imageFile.size > 0) {
            const blob = await put(imageFile.name, imageFile, {
                access: 'public',
            });
            imageUrl = blob.url;
        }

        await db.insert(achievements).values({
            id: uuidv4(),
            title,
            student,
            description,
            imageUrl,
        });

        revalidateTag('achievements-collection');
        revalidatePath('/achievements');
        revalidatePath('/admin/achievements');
        return { success: true, message: 'Prestasi berhasil ditambahkan.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Gagal menambahkan prestasi.' };
    }
}

export async function updateAchievement(
    id: string,
    currentImageUrl: string | null,
    prevState: any,
    formData: FormData,
) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'Tidak terautentikasi.' };
    }

    const validatedFields = AchievementSchema.safeParse({
        title: formData.get('title'),
        student: formData.get('student'),
        description: formData.get('description'),
    });

    if (!validatedFields.success) {
        const errorMessages = Object.values(
            validatedFields.error.flatten().fieldErrors,
        )
            .flat()
            .join(', ');
        return { success: false, message: `Validasi gagal: ${errorMessages}` };
    }

    const { title, student, description } = validatedFields.data;
    const imageFile = formData.get('image') as File | null;

    const updateData: {
        title: string;
        student: string;
        description: string;
        imageUrl?: string;
    } = {
        title,
        student,
        description,
    };

    try {
        if (imageFile && imageFile.size > 0) {
            if (currentImageUrl && !currentImageUrl.includes('placehold.co')) {
                await del(currentImageUrl);
            }
            const blob = await put(imageFile.name, imageFile, {
                access: 'public',
            });
            updateData.imageUrl = blob.url;
        }

        await db
            .update(achievements)
            .set(updateData)
            .where(eq(achievements.id, id));

        revalidateTag('achievements-collection');
        revalidatePath('/achievements');
        revalidatePath('/admin/achievements');
        return { success: true, message: 'Prestasi berhasil diperbarui.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Gagal memperbarui prestasi.' };
    }
}

export async function deleteAchievement(id: string, imageUrl: string | null) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'Tidak terautentikasi.' };
    }

    try {
        if (imageUrl && !imageUrl.includes('placehold.co')) {
            try {
                await del(imageUrl);
            } catch (blobError) {
                console.error('Failed to delete image from Vercel Blob:', blobError);
                // Continue with database deletion even if blob deletion fails
            }
        }
        await db.delete(achievements).where(eq(achievements.id, id));

        revalidateTag('achievements-collection');
        revalidatePath('/achievements');
        revalidatePath('/admin/achievements');
        return { success: true, message: 'Prestasi berhasil dihapus.' };
    } catch (error: any) {
        console.error('Database deletion failed:', error);
        return { success: false, message: `Gagal menghapus prestasi: ${error.message || error.toString()}` };
    }
}
