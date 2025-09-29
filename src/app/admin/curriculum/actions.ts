import { db } from '@/lib/db';
import { curriculums } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getCurriculumDocuments(category: string) {
    try {
        const result = await db
            .select()
            .from(curriculums)
            .where(eq(curriculums.category, category));
        return { data: result };
    } catch (error) {
        return { error: 'Gagal mengambil data dokumen kurikulum' };
    }
}

export async function createCurriculumDocument(data: {
    title: string;
    description: string;
    pdfUrl: string;
    category: string;
}) {
    try {
        const result = await db
            .insert(curriculums)
            .values({
                title: data.title,
                description: data.description,
                pdfUrl: data.pdfUrl,
                category: data.category,
            })
            .returning();
        revalidatePath('/admin/curriculum');
        revalidatePath('/profile/curriculum');
        return { data: result, success: true };
    } catch (error) {
        return { error: 'Gagal membuat dokumen kurikulum' };
    }
}

export async function updateCurriculumDocument(
    id: number,
    data: {
        title: string;
        description: string;
        pdfUrl: string;
    },
) {
    try {
        const result = await db
            .update(curriculums)
            .set({
                title: data.title,
                description: data.description,
                pdfUrl: data.pdfUrl,
                updatedAt: new Date(),
            })
            .where(eq(curriculums.id, id))
            .returning();
        revalidatePath('/admin/curriculum');
        revalidatePath('/profile/curriculum');
        return { data: result, success: true };
    } catch (error) {
        return { error: 'Gagal memperbarui dokumen kurikulum' };
    }
}

export async function deleteCurriculumDocument(id: number) {
    try {
        await db.delete(curriculums).where(eq(curriculums.id, id));
        revalidatePath('/admin/curriculum');
        revalidatePath('/profile/curriculum');
        return { success: true };
    } catch (error) {
        return { error: 'Gagal menghapus dokumen kurikulum' };
    }
}
