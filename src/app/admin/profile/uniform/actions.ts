'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { uniforms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { put, del } from '@vercel/blob';
import { z } from 'zod';

const uniformSchema = z.object({
  day: z.string().optional(),
  type: z.enum(['daily', 'sport']),
  description: z.string().min(1, 'Deskripsi tidak boleh kosong'),
  image: z.instanceof(File).optional(),
});

export async function createUniform(formData: FormData) {
  const validatedFields = uniformSchema.safeParse({
    day: formData.get('day'),
    type: formData.get('type'),
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

  const { day, type, description, image } = validatedFields.data;

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
      day,
      type,
      description,
      image: imageUrl,
    });

    revalidatePath('/admin/profile/uniform');
    revalidatePath('/profile/uniform');
    return { success: true, message: 'Seragam berhasil ditambahkan.' };
  } catch (error) {
    console.error("Error creating uniform in DB:", error);
    return { success: false, message: 'Gagal menambahkan seragam.' };
  }
}

export async function updateUniform(id: number, formData: FormData) {
  const validatedFields = uniformSchema.safeParse({
    day: formData.get('day'),
    type: formData.get('type'),
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

  const { day, type, description, image } = validatedFields.data;

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
        day,
        type,
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

export async function seedSportUniform() {
  try {
    const existingSportUniform = await db.query.uniforms.findFirst({
      where: eq(uniforms.type, 'sport'),
    });

    if (existingSportUniform) {
      return { success: true, message: 'Seragam olah raga sudah ada.' };
    }

    await db.insert(uniforms).values({
      type: 'sport',
      description: 'Seragam olah raga untuk kegiatan jasmani.',
      // day is intentionally left null
    });

    revalidatePath('/admin/profile/uniform');
    revalidatePath('/profile/uniform');
    return { success: true, message: 'Contoh seragam olah raga berhasil ditambahkan.' };
  } catch (error) {
    console.error("Error seeding sport uniform:", error);
    return { success: false, message: 'Gagal menambahkan contoh seragam.' };
  }
}
