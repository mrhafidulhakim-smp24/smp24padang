import { db } from '@/lib/db';
import { contact } from '@/lib/db/schema';
import { unstable_cache as cache } from 'next/cache';

export const getContactInfo = cache(
    async () => {
        try {
            const contactData = await db.select().from(contact).limit(1);
            return contactData[0] || null;
        } catch (error) {
            console.error('Error fetching contact info:', error);
            return null;
        }
    },
    ['contact-info'],
    { tags: ['contact-info-collection'] },
);
