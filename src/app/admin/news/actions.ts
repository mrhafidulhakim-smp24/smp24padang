'use server';

import { db } from '@/lib/db';
import { news } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { put, del } from '@vercel/blob';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NewsArticleSchema } from './schema';
import { v4 as uuidv4 } from 'uuid';

export async function getNewsForAdmin() {
    return await db.select().from(news).orderBy(desc(news.date));
}



export async function createNewsArticle(prevState: any, formData: FormData) {
    const validatedFields = NewsArticleSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        date: formData.get('date'),
    });

    if (!validatedFields.success) {
        const errorMessages = Object.values(
            validatedFields.error.flatten().fieldErrors,
        )
            .flat()
            .join(', ');
        return { success: false, message: `Validasi gagal: ${errorMessages}` };
    }

    const { title, description, date } = validatedFields.data;
    const imageFile = formData.get('image') as File | null;
    let imageUrl: string | null = null;

    try {
        if (imageFile && imageFile.size > 0) {
            const blob = await put(imageFile.name, imageFile, {
                access: 'public',
            });
            imageUrl = blob.url;
        }

        const [newArticle] = await db.insert(news).values({
            id: uuidv4(),
            title,
            description,
            date: date.toISOString(),
            imageUrl,
        }).returning({ id: news.id });

        revalidateTag('news-collection');
        revalidatePath('/admin/news');
        revalidatePath('/news');
        revalidatePath(`/news/${newArticle.id}`);
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
    });

    if (!validatedFields.success) {
        const errorMessages = Object.values(
            validatedFields.error.flatten().fieldErrors,
        )
            .flat()
            .join(', ');
        return { success: false, message: `Validasi gagal: ${errorMessages}` };
    }

    const { title, description, date } = validatedFields.data;
    const imageFile = formData.get('image') as File | null;

    const updateData: {
        title: string;
        description: string;
        date: string;
        imageUrl?: string;
    } = {
        title,
        description,
        date: date.toISOString(),
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
        revalidatePath(`/articles/${id}`);
        revalidatePath('/admin/news');
        revalidatePath('/news');
        revalidatePath(`/news/${id}`);
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
        revalidatePath('/admin/news');
        revalidatePath('/news');
        revalidatePath(`/news/${id}`);
        return { success: true, message: 'Berita berhasil dihapus.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Gagal menghapus berita.' };
    }
}