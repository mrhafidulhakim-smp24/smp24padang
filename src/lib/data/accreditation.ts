import { db } from '@/lib/db';
import { accreditations } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function getAccreditations() {
    try {
        const result = await db
            .select()
            .from(accreditations)
            .orderBy(desc(accreditations.createdAt));
        return result;
    } catch (error) {
        console.error('Error fetching accreditations:', error);
        return [];
    }
}
