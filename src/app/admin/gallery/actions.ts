'use server';

import { db } from '@/lib/db';
import { galleryItems } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { put, del } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function getGalleryItems() {
    return await db
        .select()
        .from(galleryItems)
        .orderBy(desc(galleryItems.createdAt));
}

export async function createGalleryItem(prevState: any, formData: FormData) {
    const alt = formData.get('alt') as string;
    const category = formData.get('category') as string;
    const imageFile = formData.get('image') as File;

    if (!alt || !category || !imageFile || imageFile.size === 0) {
        return { success: false, message: 'Data tidak lengkap.' };
    }

    try {
        const blob = await put(imageFile.name, imageFile, { access: 'public' });

        await db.insert(galleryItems).values({
            id: uuidv4(),
            src: blob.url,
            alt,
            category,
        });

        revalidatePath('/gallery');
        revalidatePath('/admin/gallery');
        return { success: true, message: 'Gambar berhasil ditambahkan.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Gagal menambahkan gambar.' };
    }
}

export async function deleteGalleryItem(id: string, src: string) {
    try {
        if (src && !src.includes('placehold.co')) {
            await del(src);
        }
        await db.delete(galleryItems).where(eq(galleryItems.id, id));

        revalidatePath('/gallery');
        revalidatePath('/admin/gallery');
        return { success: true, message: 'Gambar berhasil dihapus.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Gagal menghapus gambar.' };
    }
}
