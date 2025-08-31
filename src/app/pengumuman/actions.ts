'use server';

import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function getAnnouncements() {
    return await db.select().from(announcements).orderBy(desc(announcements.date));
}
