'use server';

import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { unstable_cache as cache } from 'next/cache';

export const getAnnouncements = cache(
    async () => {
        return await db.select().from(announcements).orderBy(desc(announcements.date));
    },
    ['announcements'],
    {
        tags: ['announcements-collection'],
    },
);
