
"use server";

import prisma from '@/lib/prisma';
import { put, del } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { NewsArticleSchema } from './schema';

export async function getNewsForAdmin() {
    return await prisma.news.findMany({
        orderBy: { date: 'desc' }
    });
}

export async function createNewsArticle(prevState: any, formData: FormData) {
    const validatedFields = NewsArticleSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        date: formData.get('date'),
    });

    if (!validatedFields.success) {
        return { success: false, message: 'Validasi data gagal.' };
    }
    
    const { title, description, date } = validatedFields.data;
    const imageFile = formData.get('image') as File | null;
    let imageUrl: string | null = null;

    try {
        if (imageFile && imageFile.size > 0) {
            const blob = await put(imageFile.name, imageFile, { access: 'public' });
            imageUrl = blob.url;
        }

        await prisma.news.create({
            data: {
                title,
                description,
                date,
                imageUrl,
            }
        });

        revalidatePath('/news');
        revalidatePath('/admin/news');
        return { success: true, message: 'Artikel berhasil dibuat.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Gagal membuat artikel.' };
    }
}

export async function updateNewsArticle(id: string, currentImageUrl: string | null, prevState: any, formData: FormData) {
    const validatedFields = NewsArticleSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        date: formData.get('date'),
    });

    if (!validatedFields.success) {
        return { success: false, message: 'Validasi data gagal.' };
    }

    const { title, description, date } = validatedFields.data;
    const imageFile = formData.get('image') as File | null;
    let newImageUrl = currentImageUrl;

    try {
        if (imageFile && imageFile.size > 0) {
            // Delete old image if it exists and is not a placeholder
            if (currentImageUrl && !currentImageUrl.includes('placehold.co')) {
                await del(currentImageUrl);
            }
            const blob = await put(imageFile.name, imageFile, { access: 'public' });
            newImageUrl = blob.url;
        }

        await prisma.news.update({
            where: { id },
            data: {
                title,
                description,
                date,
                imageUrl: newImageUrl,
            },
        });

        revalidatePath('/news');
        revalidatePath(`/news/${id}`);
        revalidatePath('/admin/news');
        return { success: true, message: "Artikel berhasil diperbarui." };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Gagal memperbarui artikel." };
    }
}

export async function deleteNewsArticle(id: string, imageUrl: string | null) {
    try {
        if (imageUrl && !imageUrl.includes('placehold.co')) {
            await del(imageUrl);
        }
        await prisma.news.delete({ where: { id } });
        
        revalidatePath('/news');
        revalidatePath('/admin/news');
        return { success: true, message: 'Berita berhasil dihapus.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Gagal menghapus berita.' };
    }
}
