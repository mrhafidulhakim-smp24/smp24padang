'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { videos } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function createVideo(data: typeof videos.$inferInsert) {
    try {
        await db.insert(videos).values(data);
        revalidatePath('/admin/videos');
        revalidatePath('/videos');
        return { success: true, message: 'Video berhasil ditambahkan.' };
    } catch (error: any) {
        console.error('Error creating video:', error);
        return { success: false, message: `Gagal menambahkan video: ${error.message || error.toString()}` };
    }
}

export async function updateVideo(id: number, data: Partial<typeof videos.$inferInsert>) {
    try {
        await db.update(videos).set(data).where(eq(videos.id, id));
        revalidatePath('/admin/videos');
        revalidatePath('/videos');
        return { success: true, message: 'Video berhasil diperbarui.' };
    } catch (error: any) {
        console.error('Error updating video:', error);
        return { success: false, message: `Gagal memperbarui video: ${error.message || error.toString()}` };
    }
}

export async function deleteVideo(id: number) {
    try {
        await db.delete(videos).where(eq(videos.id, id));
        revalidatePath('/admin/videos');
        revalidatePath('/videos');
        return { success: true, message: 'Video berhasil dihapus.' };
    } catch (error: any) {
        console.error('Error deleting video:', error);
        return { success: false, message: `Gagal menghapus video: ${error.message || error.toString()}` };
    }
}
