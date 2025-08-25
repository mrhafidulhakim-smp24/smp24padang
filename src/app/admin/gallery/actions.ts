
"use server";

import prisma from '@/lib/prisma';
import { put, del } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

export async function getGalleryItems() {
  return await prisma.galleryItem.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function createGalleryItem(prevState: any, formData: FormData) {
  const alt = formData.get('alt') as string;
  const category = formData.get('category') as string;
  const imageFile = formData.get('image') as File;

  if (!alt || !category || !imageFile || imageFile.size === 0) {
    return { success: false, message: "Data tidak lengkap." };
  }

  try {
    const blob = await put(imageFile.name, imageFile, { access: 'public' });

    await prisma.galleryItem.create({
      data: {
        src: blob.url,
        alt,
        category,
      },
    });

    revalidatePath('/gallery');
    revalidatePath('/admin/gallery');
    return { success: true, message: "Gambar berhasil ditambahkan." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Gagal menambahkan gambar." };
  }
}

export async function deleteGalleryItem(id: string, src: string) {
  try {
    if (src && !src.includes('placehold.co')) {
      await del(src);
    }
    await prisma.galleryItem.delete({ where: { id } });

    revalidatePath('/gallery');
    revalidatePath('/admin/gallery');
    return { success: true, message: "Gambar berhasil dihapus." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Gagal menghapus gambar." };
  }
}
