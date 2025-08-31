'use server';

import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { unstable_cache as cache } from 'next/cache';

export const getAnnouncements = cache(
    async () => {
        const allAnnouncements = await db.select().from(announcements);
        
        allAnnouncements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        return allAnnouncements;
    },
    ['announcements'],
    {
        tags: ['announcements-collection'],
    },
);
