'use server';

import { revalidatePath } from 'next/cache';
import { put, del } from '@vercel/blob';
import { db } from '@/lib/db';
import { academics } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { AcademicData } from './schema';

export async function getAcademics() {
    let academicsData = await db
        .select()
        .from(academics)
        .where(eq(academics.id, '1'))
        .limit(1);
    let result = academicsData[0];

    if (!result) {
        // If no data exists, create a default entry
        const defaultData = {
            id: '1', // Singleton ID
            curriculumTitle: 'Kurikulum Merdeka yang Adaptif & Inovatif',
            curriculumDescription: 'Deskripsi kurikulum default.',
            curriculumImageUrl: 'https://placehold.co/1200x400.png',
            structureTitle: 'Struktur Pembelajaran yang Mendukung',
            structureDescription: 'Deskripsi struktur pembelajaran default.',
            structureImageUrl: 'https://placehold.co/1200x400.png',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await db.insert(academics).values(defaultData);
        result = defaultData;
    }
    return result;
}

export async function updateAcademics(formData: FormData) {
    const id = '1'; // Singleton ID

    const data: Partial<AcademicData> & {
        currentCurriculumImageUrl?: string;
        currentStructureImageUrl?: string;
    } = {
        curriculumTitle: formData.get('curriculumTitle') as string,
        curriculumDescription: formData.get('curriculumDescription') as string,
        structureTitle: formData.get('structureTitle') as string,
        structureDescription: formData.get('structureDescription') as string,
        currentCurriculumImageUrl: formData.get(
            'currentCurriculumImageUrl',
        ) as string,
        currentStructureImageUrl: formData.get(
            'currentStructureImageUrl',
        ) as string,
    };

    const curriculumImageFile = formData.get('curriculumImage') as File | null;
    const structureImageFile = formData.get('structureImage') as File | null;

    try {
        const updateData: any = {
            curriculumTitle: data.curriculumTitle,
            curriculumDescription: data.curriculumDescription,
            structureTitle: data.structureTitle,
            structureDescription: data.structureDescription,
            updatedAt: new Date(),
        };

        if (curriculumImageFile && curriculumImageFile.size > 0) {
            // Delete old image if it exists and is not a placeholder
            if (
                data.currentCurriculumImageUrl &&
                !data.currentCurriculumImageUrl.includes('placehold.co')
            ) {
                await del(data.currentCurriculumImageUrl);
            }
            const blob = await put(
                curriculumImageFile.name,
                curriculumImageFile,
                { access: 'public' },
            );
            updateData.curriculumImageUrl = blob.url;
        }

        if (structureImageFile && structureImageFile.size > 0) {
            // Delete old image if it exists and is not a placeholder
            if (
                data.currentStructureImageUrl &&
                !data.currentStructureImageUrl.includes('placehold.co')
            ) {
                await del(data.currentStructureImageUrl);
            }
            const blob = await put(
                structureImageFile.name,
                structureImageFile,
                { access: 'public' },
            );
            updateData.structureImageUrl = blob.url;
        }

        await db.update(academics).set(updateData).where(eq(academics.id, id));

        revalidatePath('/academics');
        revalidatePath('/admin/academics');

        return { success: true, message: 'Data akademik berhasil diperbarui.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Gagal memperbarui data akademik.' };
    }
}
