'use server';

import { db } from '@/lib/db';
import { galleryItems } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function getGalleryItems() {
    return await db
        .select()
        .from(galleryItems)
        .orderBy(desc(galleryItems.createdAt));
}
