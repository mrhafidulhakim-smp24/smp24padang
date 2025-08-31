'use server';

import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { revalidatePath, revalidateTag } from 'next/cache';
import { AnnouncementSchema } from './schema';
import { v4 as uuidv4 } from 'uuid';

export async function getAnnouncementsForAdmin() {
    return await db.select().from(announcements).orderBy(desc(announcements.date));
}

export async function createAnnouncement(prevState: any, formData: FormData) {
    const validatedFields = AnnouncementSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        date: formData.get('date'),
        pdfUrl: formData.get('pdfUrl'),
    });

    if (!validatedFields.success) {
        const errorMessages = Object.values(validatedFields.error.flatten().fieldErrors).flat().join(', ');
        return { success: false, message: `Validasi gagal: ${errorMessages}` };
    }
    
    const { title, description, date, pdfUrl } = validatedFields.data;

    try {
        await db.insert(announcements).values({
            id: uuidv4(),
            title,
            description,
            date: date.toISOString(),
            pdfUrl,
        });

        revalidateTag('announcements-collection');
        revalidatePath('/');
        revalidatePath('/pengumuman');
        revalidatePath('/admin/announcements');
        return { success: true, message: 'Pengumuman berhasil dibuat.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Gagal membuat pengumuman.' };
    }
}

export async function updateAnnouncement(id: string, prevState: any, formData: FormData) {
    const validatedFields = AnnouncementSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        date: formData.get('date'),
        pdfUrl: formData.get('pdfUrl'),
    });

    if (!validatedFields.success) {
        const errorMessages = Object.values(validatedFields.error.flatten().fieldErrors).flat().join(', ');
        return { success: false, message: `Validasi gagal: ${errorMessages}` };
    }

    const { title, description, date, pdfUrl } = validatedFields.data;

    const updateData: { title: string; description: string; date: string; pdfUrl?: string | null; } = {
        title,
        description,
        date: date.toISOString(),
        pdfUrl,
    };


    try {
        await db.update(announcements).set(updateData).where(eq(announcements.id, id));

        revalidateTag('announcements-collection');
        revalidatePath('/');
        revalidatePath(`/announcements/${id}`);
        revalidatePath('/pengumuman');
        revalidatePath('/admin/announcements');
        return { success: true, message: "Pengumuman berhasil diperbarui." };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Gagal memperbarui pengumuman." };
    }
}

export async function deleteAnnouncement(id: string) {
    try {
        await db.delete(announcements).where(eq(announcements.id, id));
        
        revalidateTag('announcements-collection');
        revalidatePath('/');
        revalidatePath('/pengumuman');
        revalidatePath('/admin/announcements');
        return { success: true, message: 'Pengumuman berhasil dihapus.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Gagal menghapus pengumuman.' };
    }
}