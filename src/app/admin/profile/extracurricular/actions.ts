'use server';

import { db } from '@/lib/db';
import { extracurriculars } from '@/lib/db/schema';
import { put, del } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';

export async function getExtracurriculars() {
  try {
    const data = await db.query.extracurriculars.findMany({
      orderBy: [desc(extracurriculars.createdAt)],
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch extracurriculars:", error);
    return { success: false, message: 'Gagal memuat data ekstrakurikuler.' };
  }
}

const extracurricularSchema = z.object({
  name: z.string().min(1, 'Nama kegiatan tidak boleh kosong'),
  category: z.string().min(1, 'Kategori tidak boleh kosong'),
  description: z.string().min(1, 'Deskripsi tidak boleh kosong'),
  image: z.instanceof(File).optional(),
});

export async function createExtracurricular(formData: FormData) {
  const validatedFields = extracurricularSchema.safeParse({
    name: formData.get('name'),
    category: formData.get('category'),
    description: formData.get('description'),
    image: formData.get('image'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, category, description, image } = validatedFields.data;

  let imageUrl: string | undefined;

  if (image && image.size > 0) {
    const blob = await put(image.name, image, {
      access: 'public',
    });
    imageUrl = blob.url;
  }

  try {
    await db.insert(extracurriculars).values({
      id: crypto.randomUUID(),
      name,
      category,
      description,
      image: imageUrl,
    });

    revalidatePath('/admin/profile/extracurricular');

    return {
      success: true,
      message: 'Kegiatan ekstrakurikuler berhasil ditambahkan',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Gagal menambahkan kegiatan ekstrakurikuler',
    };
  }
}

export async function updateExtracurricular(id: string, formData: FormData) {
  const validatedFields = extracurricularSchema.safeParse({
    name: formData.get('name'),
    category: formData.get('category'),
    description: formData.get('description'),
    image: formData.get('image'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, category, description, image } = validatedFields.data;

  let imageUrl: string | undefined;

  const existingExtracurricular = await db.query.extracurriculars.findFirst({
    where: eq(extracurriculars.id, id),
  });

  if (!existingExtracurricular) {
    return {
      success: false,
      message: 'Kegiatan tidak ditemukan',
    };
  }

  if (image && image.size > 0) {
    if (existingExtracurricular.image) {
      try {
        await del(existingExtracurricular.image);
      } catch (error) {
        console.error("Vercel Blob deletion error during update:", error);
      }
    }
    const blob = await put(image.name, image, {
      access: 'public',
    });
    imageUrl = blob.url;
  }

  try {
    await db.update(extracurriculars).set({
      name,
      category,
      description,
      image: imageUrl ?? existingExtracurricular.image,
    }).where(eq(extracurriculars.id, id));

    revalidatePath('/admin/profile/extracurricular');

    return {
      success: true,
      message: 'Kegiatan ekstrakurikuler berhasil diperbarui',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Gagal memperbarui kegiatan ekstrakurikuler',
    };
  }
}

export async function deleteExtracurricular(id: string) {
  const existingExtracurricular = await db.query.extracurriculars.findFirst({
    where: eq(extracurriculars.id, id),
  });

  if (!existingExtracurricular) {
    return {
      success: false,
      message: 'Kegiatan tidak ditemukan',
    };
  }

  if (existingExtracurricular.image) {
    try {
      await del(existingExtracurricular.image);
    } catch (error) {
      console.error("Vercel Blob deletion error during delete:", error);
    }
  }

  try {
    await db.delete(extracurriculars).where(eq(extracurriculars.id, id));

    revalidatePath('/admin/profile/extracurricular');

    return {
      success: true,
      message: 'Kegiatan ekstrakurikuler berhasil dihapus',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Gagal menghapus kegiatan ekstrakurikuler',
    };
  }
}

export async function seedExtracurriculars() {
  try {
    await db.insert(extracurriculars).values([
      {
        id: crypto.randomUUID(),
        name: 'Pramuka',
        category: 'Organisasi',
        description: 'Kegiatan kepanduan untuk melatih kemandirian dan kepemimpinan.',
        image: 'https://placehold.co/600x400.png?text=Pramuka',
      },
      {
        id: crypto.randomUUID(),
        name: 'Futsal',
        category: 'Olahraga',
        description: 'Olahraga tim yang populer di kalangan siswa.',
        image: 'https://placehold.co/600x400.png?text=Futsal',
      },
      {
        id: crypto.randomUUID(),
        name: 'Paduan Suara',
        category: 'Seni',
        description: 'Melatih vokal dan harmoni dalam kelompok.',
        image: 'https://placehold.co/600x400.png?text=Paduan+Suara',
      },
    ]);

    revalidatePath('/admin/profile/extracurricular');

    return { success: true, message: 'Data ekstrakurikuler berhasil ditambahkan.' };
  } catch (error) {
    console.error("Error seeding extracurriculars:", error);
    return { success: false, message: 'Gagal menambahkan data ekstrakurikuler.' };
  }
}