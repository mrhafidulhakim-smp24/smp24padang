'use server';

import { db } from '@/lib/db';
import { faqs } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function getFaqsForPublic() {
    try {
        return await db
            .select()
            .from(faqs)
            .orderBy(desc(faqs.createdAt));
    } catch (error) {
        console.error('Error fetching faqs:', error);
        return [];
    }
}
