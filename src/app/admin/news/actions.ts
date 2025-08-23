
"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { Prisma } from "@prisma/client";

export const NewsArticleSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Format tanggal tidak valid" }),
  hint: z.string().optional(),
});

async function uploadImage(image: File) {
  const blob = await put(image.name, image, {
    access: "public",
  });
  return blob.url;
}

export async function createNewsArticle(formData: FormData) {
  const validatedFields = NewsArticleSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    date: formData.get("date"),
    hint: formData.get("hint"),
  });

  if (!validatedFields.success) {
    return { success: false, message: "Validasi gagal", errors: validatedFields.error.flatten().fieldErrors };
  }
  
  const { date, ...rest } = validatedFields.data;

  const image = formData.get("image") as File;
  let imageUrl;

  try {
    if (image && image.size > 0) {
      imageUrl = await uploadImage(image);
    }

    const newArticle = await prisma.newsArticle.create({
      data: {
        ...rest,
        date: new Date(date),
        imageUrl,
      },
    });
    revalidatePath("/admin/news");
    revalidatePath("/news");
    return { success: true, data: newArticle };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return { success: false, message: `Gagal menyimpan: ${e.message}` };
    }
    return { success: false, message: "Terjadi kesalahan pada server." };
  }
}

export async function updateNewsArticle(id: string, currentImageUrl: string | null, formData: FormData) {
    const validatedFields = NewsArticleSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        date: formData.get('date'),
        hint: formData.get('hint'),
    });

    if (!validatedFields.success) {
        return { success: false, message: 'Validasi gagal', errors: validatedFields.error.flatten().fieldErrors };
    }
    
    const { date, ...rest } = validatedFields.data;

    const image = formData.get('image') as File;
    let newImageUrl;

    try {
        if (image && image.size > 0) {
            if (currentImageUrl) {
                await del(currentImageUrl);
            }
            newImageUrl = await uploadImage(image);
        }

        const updatedArticle = await prisma.newsArticle.update({
            where: { id },
            data: {
                ...rest,
                date: new Date(date),
                ...(newImageUrl && { imageUrl: newImageUrl }),
            },
        });

        revalidatePath('/admin/news');
        revalidatePath('/news');
        return { success: true, data: updatedArticle };
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return { success: false, message: `Gagal memperbarui: ${e.message}` };
        }
        return { success: false, message: 'Terjadi kesalahan pada server.' };
    }
}


export async function deleteNewsArticle(id: string, imageUrl: string | null) {
    try {
        if (imageUrl) {
            await del(imageUrl);
        }
        
        await prisma.newsArticle.delete({
            where: { id },
        });

        revalidatePath('/admin/news');
        revalidatePath('/news');
        return { success: true, message: 'Berita berhasil dihapus.' };
    } catch (e) {
         if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return { success: false, message: `Gagal menghapus: ${e.message}` };
        }
        return { success: false, message: 'Terjadi kesalahan pada server.' };
    }
}
