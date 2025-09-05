'use server';

import { db } from '@/lib/db';
import { news, videos } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { put, del } from '@vercel/blob';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NewsArticleSchema } from './schema';
import { v4 as uuidv4 } from 'uuid';

export async function getNewsForAdmin() {
    return await db.select().from(news).orderBy(desc(news.date));
}

export async function getVideosForSelect() {
    return await db.select({ id: videos.id, title: videos.title }).from(videos).orderBy(desc(videos.createdAt));
}

export async function createNewsArticle(prevState: any, formData: FormData) {
    const validatedFields = NewsArticleSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        date: formData.get('date'),
        videoId: formData.get('videoId'),
    });

    if (!validatedFields.success) {
        const errorMessages = Object.values(
            validatedFields.error.flatten().fieldErrors,
        )
            .flat()
            .join(', ');
        return { success: false, message: `Validasi gagal: ${errorMessages}` };
    }

    const { title, description, date, videoId } = validatedFields.data;
    const imageFile = formData.get('image') as File | null;
    let imageUrl: string | null = null;

    try {
        if (imageFile && imageFile.size > 0) {
            const blob = await put(imageFile.name, imageFile, {
                access: 'public',
            });
            imageUrl = blob.url;
        }

        await db.insert(news).values({
            id: uuidv4(),
            title,
            description,
            date: date.toISOString(),
            imageUrl,
            videoId: videoId ? parseInt(videoId, 10) : null,
        });

        revalidateTag('news-collection');
        revalidatePath('/');
        revalidatePath('/admin/news');
        return { success: true, message: 'Artikel berhasil dibuat.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Gagal membuat artikel.' };
    }
}

export async function updateNewsArticle(
    id: string,
    currentImageUrl: string | null,
    prevState: any,
    formData: FormData,
) {
    const validatedFields = NewsArticleSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        date: formData.get('date'),
        videoId: formData.get('videoId'),
    });

    if (!validatedFields.success) {
        const errorMessages = Object.values(
            validatedFields.error.flatten().fieldErrors,
        )
            .flat()
            .join(', ');
        return { success: false, message: `Validasi gagal: ${errorMessages}` };
    }

    const { title, description, date, videoId } = validatedFields.data;
    const imageFile = formData.get('image') as File | null;

    const updateData: {
        title: string;
        description: string;
        date: string;
        imageUrl?: string;
        videoId?: number | null;
    } = {
        title,
        description,
        date: date.toISOString(),
        videoId: videoId ? parseInt(videoId, 10) : null,
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

        await db.update(news).set(updateData).where(eq(news.id, id));

        revalidateTag('news-collection');
        revalidatePath('/');
        revalidatePath(`/articles/${id}`);
        revalidatePath('/admin/news');
        return { success: true, message: 'Artikel berhasil diperbarui.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Gagal memperbarui artikel.' };
    }
}

export async function deleteNewsArticle(id: string, imageUrl: string | null) {
    try {
        if (imageUrl && !imageUrl.includes('placehold.co')) {
            await del(imageUrl);
        }
        await db.delete(news).where(eq(news.id, id));

        revalidateTag('news-collection');
        revalidatePath('/');
        revalidatePath('/admin/news');
        return { success: true, message: 'Berita berhasil dihapus.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Gagal menghapus berita.' };
    }
}