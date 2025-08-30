'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { uniforms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { put, del } from '@vercel/blob';
import { z } from 'zod';

const uniformSchema = z.object({
  description: z.string().min(1, 'Deskripsi tidak boleh kosong'),
  image: z.instanceof(File).optional(),
});

export async function createSportUniform(formData: FormData) {
  const validatedFields = uniformSchema.safeParse({
    description: formData.get('description'),
    image: formData.get('image'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validasi gagal',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { description, image } = validatedFields.data;

  let imageUrl: string | undefined;

  if (image && image.size > 0) {
    try {
      const blob = await put(image.name, image, {
        access: 'public',
      });
      imageUrl = blob.url;
    } catch (error) {
      console.error("Error uploading image to Vercel Blob:", error);
      return { success: false, message: 'Gagal mengunggah gambar.' };
    }
  }

  try {
    await db.insert(uniforms).values({
      type: 'sport',
      description,
      image: imageUrl,
    });

    revalidatePath('/admin/profile/uniform');
    revalidatePath('/profile/uniform');
    return { success: true, message: 'Seragam olah raga berhasil ditambahkan.' };
  } catch (error) {
    console.error("Error creating uniform in DB:", error);
    return { success: false, message: 'Gagal menambahkan seragam olah raga.' };
  }
}

export async function updateUniform(id: number, formData: FormData) {
  const validatedFields = uniformSchema.safeParse({
    description: formData.get('description'),
    image: formData.get('image'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validasi gagal',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { description, image } = validatedFields.data;

  let imageUrl: string | undefined;

  const existingUniform = await db.query.uniforms.findFirst({
    where: eq(uniforms.id, id),
  });

  if (!existingUniform) {
    return { success: false, message: 'Seragam tidak ditemukan.' };
  }

  if (image && image.size > 0) {
    try {
      if (existingUniform.image) {
        await del(existingUniform.image);
      }
      const blob = await put(image.name, image, {
        access: 'public',
      });
      imageUrl = blob.url;
    } catch (error) {
      console.error("Error uploading new image to Vercel Blob:", error);
      return { success: false, message: 'Gagal mengunggah gambar baru.' };
    }
  }

  try {
    await db.update(uniforms)
      .set({
        description,
        image: imageUrl ?? existingUniform.image,
      })
      .where(eq(uniforms.id, id));

    revalidatePath('/admin/profile/uniform');
    revalidatePath('/profile/uniform');
    return { success: true, message: 'Seragam berhasil diperbarui.' };
  } catch (error) {
    console.error("Error updating uniform in DB:", error);
    return { success: false, message: 'Gagal memperbarui seragam.' };
  }
}

export async function deleteUniform(id: number) {
  const existingUniform = await db.query.uniforms.findFirst({
    where: eq(uniforms.id, id),
  });

  if (!existingUniform) {
    return { success: false, message: 'Seragam tidak ditemukan.' };
  }

  if (existingUniform.image) {
    try {
      await del(existingUniform.image);
    } catch (error) {
      console.error("Error deleting image from Vercel Blob:", error);
      // Continue with deletion even if image deletion fails
    }
  }

  try {
    await db.delete(uniforms).where(eq(uniforms.id, id));

    revalidatePath('/admin/profile/uniform');
    revalidatePath('/profile/uniform');
    return { success: true, message: 'Seragam berhasil dihapus.' };
  } catch (error) {
    console.error("Error deleting uniform from DB:", error);
    return { success: false, message: 'Gagal menghapus seragam.' };
  }
}
