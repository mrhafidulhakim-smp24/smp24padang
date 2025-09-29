'use server';

import { eq } from 'drizzle-orm';
import { db } from '..';
import { curriculums } from '../schema';
import { revalidatePath } from 'next/cache';

interface CurriculumInput {
    title: string;
    description: string;
    pdfUrl: string;
    category: string;
}

export async function getCurriculum() {
    try {
        const result = await db.select().from(curriculums);
        return { data: result };
    } catch (error) {
        console.error('Error fetching curriculum:', error);
        return { error: 'Failed to fetch curriculum' };
    }
}

export async function createCurriculum(data: CurriculumInput) {
    try {
        const result = await db.insert(curriculums).values(data).returning();
        revalidatePath('/admin/curriculum');
        revalidatePath('/profile/curriculum');
        return { data: result[0] };
    } catch (error) {
        console.error('Error creating curriculum:', error);
        return { error: 'Failed to create curriculum' };
    }
}

export async function updateCurriculum(
    id: number,
    data: Partial<CurriculumInput>,
) {
    try {
        const result = await db
            .update(curriculums)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(curriculums.id, id))
            .returning();
        revalidatePath('/admin/curriculum');
        revalidatePath('/profile/curriculum');
        return { data: result[0] };
    } catch (error) {
        console.error('Error updating curriculum:', error);
        return { error: 'Failed to update curriculum' };
    }
}

export async function deleteCurriculum(id: number) {
    try {
        const result = await db
            .delete(curriculums)
            .where(eq(curriculums.id, id))
            .returning();
        revalidatePath('/admin/curriculum');
        revalidatePath('/profile/curriculum');
        return { data: result[0] };
    } catch (error) {
        console.error('Error deleting curriculum:', error);
        return { error: 'Failed to delete curriculum' };
    }
}
