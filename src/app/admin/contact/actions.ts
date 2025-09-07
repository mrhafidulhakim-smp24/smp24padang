'use server';

import { db } from '@/lib/db';
import { contact } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath, revalidateTag } from 'next/cache';
import { unstable_cache as cache } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

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

export async function updateContactInfo(data: {
    address: string;
    phone: string;
    email: string;
    googleMapsUrl: string | null;
}) {
    try {
        const existingContact = await db.select().from(contact).limit(1);

        if (existingContact.length > 0) {
            await db
                .update(contact)
                .set({
                    address: data.address,
                    phone: data.phone,
                    email: data.email,
                    googleMapsUrl: data.googleMapsUrl,
                    updatedAt: new Date(),
                })
                .where(eq(contact.id, existingContact[0].id));
        } else {
            await db.insert(contact).values({
                id: uuidv4(),
                ...data,
            });
        }

        revalidateTag('contact-info-collection');

        return {
            success: true,
            message: 'Informasi kontak berhasil diperbarui.',
        };
    } catch (error) {
        console.error('Error updating contact info:', error);
        return {
            success: false,
            message: 'Gagal memperbarui informasi kontak.',
        };
    }
}
