"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { Prisma } from "@prisma/client";
import { getAchievements } from "@/app/achievements/actions";

export const AchievementSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  student: z.string().min(3, "Siswa/Tim minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  hint: z.string().optional(),
});

async function uploadImage(image: File) {
  const blob = await put(image.name, image, {
    access: "public",
  });
  return blob.url;
}

export async function createAchievement(formData: FormData) {
  const validatedFields = AchievementSchema.safeParse({
    title: formData.get("title"),
    student: formData.get("student"),
    description: formData.get("description"),
    hint: formData.get("hint"),
  });

  if (!validatedFields.success) {
    return { success: false, message: "Validasi gagal", errors: validatedFields.error.flatten().fieldErrors };
  }

  const image = formData.get("image") as File;
  let imageUrl;

  if (image && image.size > 0) {
    imageUrl = await uploadImage(image);
  }

  try {
    const newAchievement = await prisma.achievement.create({
      data: {
        ...validatedFields.data,
        imageUrl,
      },
    });
    revalidatePath("/admin/achievements");
    revalidatePath("/achievements");
    return { success: true, data: newAchievement };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return { success: false, message: `Gagal menyimpan: ${e.message}` };
    }
    return { success: false, message: "Terjadi kesalahan pada server." };
  }
}

export async function updateAchievement(id: string, currentImageUrl: string | null, formData: FormData) {
    const validatedFields = AchievementSchema.safeParse({
        title: formData.get('title'),
        student: formData.get('student'),
        description: formData.get('description'),
        hint: formData.get('hint'),
    });

    if (!validatedFields.success) {
        return { success: false, message: 'Validasi gagal', errors: validatedFields.error.flatten().fieldErrors };
    }

    const image = formData.get('image') as File;
    let newImageUrl;

    try {
        if (image && image.size > 0) {
            // Hapus gambar lama jika ada
            if (currentImageUrl) {
                await del(currentImageUrl);
            }
            // Unggah gambar baru
            newImageUrl = await uploadImage(image);
        }

        const updatedAchievement = await prisma.achievement.update({
            where: { id },
            data: {
                ...validatedFields.data,
                ...(newImageUrl && { imageUrl: newImageUrl }),
            },
        });

        revalidatePath('/admin/achievements');
        revalidatePath('/achievements');
        return { success: true, data: updatedAchievement };
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return { success: false, message: `Gagal memperbarui: ${e.message}` };
        }
        return { success: false, message: 'Terjadi kesalahan pada server.' };
    }
}


export async function deleteAchievement(id: string, imageUrl: string | null) {
    try {
        // Hapus gambar dari Vercel Blob jika ada
        if (imageUrl) {
            await del(imageUrl);
        }
        
        await prisma.achievement.delete({
            where: { id },
        });

        revalidatePath('/admin/achievements');
        revalidatePath('/achievements');
        return { success: true, message: 'Prestasi berhasil dihapus.' };
    } catch (e) {
         if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return { success: false, message: `Gagal menghapus: ${e.message}` };
        }
        return { success: false, message: 'Terjadi kesalahan pada server.' };
    }
}

// Export getAchievements to be used in the page
export { getAchievements };
