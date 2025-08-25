
"use server";

import prisma from '@/lib/prisma';
import { put, del } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { AchievementSchema } from './schema';

export async function getAchievements() {
  return await prisma.achievement.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function createAchievement(prevState: any, formData: FormData) {
  const validatedFields = AchievementSchema.safeParse({
    title: formData.get('title'),
    student: formData.get('student'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return { success: false, message: 'Validasi gagal.' };
  }
  
  const { title, student, description } = validatedFields.data;
  const imageFile = formData.get('image') as File;
  let imageUrl = null;

  try {
    if (imageFile && imageFile.size > 0) {
        const blob = await put(imageFile.name, imageFile, { access: 'public' });
        imageUrl = blob.url;
    }

    await prisma.achievement.create({
      data: {
        title,
        student,
        description,
        imageUrl,
      },
    });

    revalidatePath('/achievements');
    revalidatePath('/admin/achievements');
    return { success: true, message: "Prestasi berhasil ditambahkan." };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Gagal menambahkan prestasi.' };
  }
}

export async function updateAchievement(id: string, currentImageUrl: string | null, prevState: any, formData: FormData) {
    const validatedFields = AchievementSchema.safeParse({
        title: formData.get('title'),
        student: formData.get('student'),
        description: formData.get('description'),
    });

    if (!validatedFields.success) {
        return { success: false, message: 'Validasi gagal.' };
    }

    const { title, student, description } = validatedFields.data;
    const imageFile = formData.get('image') as File | null;
    let newImageUrl = currentImageUrl;

    try {
        if (imageFile && imageFile.size > 0) {
            // Delete old image if it exists and is not a placeholder
            if (currentImageUrl && !currentImageUrl.includes('placehold.co')) {
                await del(currentImageUrl);
            }
            const blob = await put(imageFile.name, imageFile, { access: 'public' });
            newImageUrl = blob.url;
        }

        await prisma.achievement.update({
            where: { id },
            data: {
                title,
                student,
                description,
                imageUrl: newImageUrl,
            },
        });

        revalidatePath('/achievements');
        revalidatePath('/admin/achievements');
        return { success: true, message: "Prestasi berhasil diperbarui." };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Gagal memperbarui prestasi." };
    }
}


export async function deleteAchievement(id: string, imageUrl: string | null) {
    try {
        if (imageUrl && !imageUrl.includes('placehold.co')) {
            await del(imageUrl);
        }
        await prisma.achievement.delete({ where: { id } });
        
        revalidatePath('/achievements');
        revalidatePath('/admin/achievements');
        return { success: true, message: 'Prestasi berhasil dihapus.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Gagal menghapus prestasi.' };
    }
}
