'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { videos } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function createVideo(data: typeof videos.$inferInsert) {
    await db.insert(videos).values(data);
    revalidatePath('/admin/videos');
}

export async function updateVideo(id: number, data: Partial<typeof videos.$inferInsert>) {
    await db.update(videos).set(data).where(eq(videos.id, id));
    revalidatePath('/admin/videos');
}

export async function deleteVideo(id: number) {
    await db.delete(videos).where(eq(videos.id, id));
    revalidatePath('/admin/videos');
}
