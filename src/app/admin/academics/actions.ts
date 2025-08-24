
"use server";

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { put, del } from '@vercel/blob';
import { Prisma } from '@prisma/client';

export const AcademicDataSchema = z.object({
  curriculumTitle: z.string().min(3, "Judul minimal 3 karakter"),
  curriculumDescription: z.string().min(10, "Deskripsi minimal 10 karakter"),
  curriculumImage: z.any().optional(),
  curriculumImageHint: z.string().optional(),
  structureTitle: z.string().min(3, "Judul minimal 3 karakter"),
  structureDescription: z.string().min(10, "Deskripsi minimal 10 karakter"),
  structureImage: z.any().optional(),
  structureImageHint: z.string().optional(),
});

export type AcademicData = z.infer<typeof AcademicDataSchema>;

async function uploadImage(image: File) {
  const blob = await put(image.name, image, { access: 'public' });
  return blob.url;
}

export async function getAcademics() {
  let academicData = await prisma.academic.findFirst();

  if (!academicData) {
    // Create a default entry if it doesn't exist
    academicData = await prisma.academic.create({
      data: {
        curriculumTitle: "Kurikulum Merdeka yang Adaptif & Inovatif",
        curriculumDescription: "SMPN 24 Padang menerapkan **Kurikulum Merdeka**, sebuah pendekatan pendidikan yang memberikan keleluasaan bagi guru untuk menciptakan pembelajaran berkualitas yang sesuai dengan kebutuhan dan minat belajar siswa. Kurikulum ini dirancang untuk menumbuhkan siswa yang kreatif, mandiri, dan bernalar kritis.\n\nKami fokus pada pembelajaran intrakurikuler yang beragam, di mana konten dioptimalkan agar siswa memiliki cukup waktu untuk mendalami konsep dan menguatkan kompetensi. Selain itu, kami mengintegrasikan **Projek Penguatan Profil Pelajar Pancasila (P5)** yang memungkinkan siswa untuk mengeksplorasi isu-isu aktual seperti lingkungan, kesehatan, dan kewirausahaan melalui pembelajaran berbasis proyek yang kolaboratif.",
        curriculumImageUrl: "https://placehold.co/1200x400.png",
        curriculumImageHint: "library books",
        structureTitle: "Struktur Pembelajaran yang Mendukung",
        structureDescription: "Struktur pembelajaran kami dirancang untuk menciptakan lingkungan belajar yang kondusif dan terarah bagi siswa jenjang Sekolah Menengah Pertama (Kelas 7-9). Setiap kelas dibimbing oleh seorang wali kelas yang berdedikasi, yang berperan sebagai fasilitator utama dan jembatan komunikasi antara sekolah, siswa, dan orang tua.\n\nWali kelas bekerja sama dengan tim guru mata pelajaran yang ahli di bidangnya untuk memastikan setiap siswa mendapatkan perhatian yang dibutuhkan, baik secara akademik maupun personal. Pendekatan ini memungkinkan kami untuk memantau perkembangan siswa secara holistik dan memberikan dukungan yang tepat waktu untuk membantu mereka mencapai potensi maksimal.",
        structureImageUrl: "https://placehold.co/1200x400.png",
        structureImageHint: "school building",
      },
    });
  }
  return academicData;
}

export async function updateAcademics(formData: FormData) {
    const validatedFields = AcademicDataSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        console.error(validatedFields.error.flatten().fieldErrors);
        return { success: false, message: 'Validasi gagal', errors: validatedFields.error.flatten().fieldErrors };
    }

    const { curriculumImage, structureImage, ...data } = validatedFields.data;
    const id = formData.get('id') as string;
    const currentCurriculumImageUrl = formData.get('currentCurriculumImageUrl') as string;
    const currentStructureImageUrl = formData.get('currentStructureImageUrl') as string;

    try {
        let newCurriculumImageUrl;
        if (curriculumImage && curriculumImage.size > 0) {
            if (currentCurriculumImageUrl) {
                await del(currentCurriculumImageUrl).catch(e => console.error("Failed to delete old curriculum image:", e));
            }
            newCurriculumImageUrl = await uploadImage(curriculumImage);
        }
        
        let newStructureImageUrl;
        if (structureImage && structureImage.size > 0) {
            if (currentStructureImageUrl) {
                await del(currentStructureImageUrl).catch(e => console.error("Failed to delete old structure image:", e));
            }
            newStructureImageUrl = await uploadImage(structureImage);
        }

        const updatedData = await prisma.academic.update({
            where: { id },
            data: {
                ...data,
                ...(newCurriculumImageUrl && { curriculumImageUrl: newCurriculumImageUrl }),
                ...(newStructureImageUrl && { structureImageUrl: newStructureImageUrl }),
            },
        });
        
        revalidatePath('/admin/academics');
        revalidatePath('/academics');
        return { success: true, data: updatedData };
    } catch (e) {
        console.error("Update error:", e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return { success: false, message: `Gagal memperbarui: ${e.message}` };
        }
        return { success: false, message: 'Terjadi kesalahan pada server.' };
    }
}
