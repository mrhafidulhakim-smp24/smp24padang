
"use server";

import { z } from 'zod';

export const AcademicDataSchema = z.object({
  curriculumTitle: z.string().min(3, "Judul minimal 3 karakter"),
  curriculumDescription: z.string().min(10, "Deskripsi minimal 10 karakter"),
  curriculumImage: z.any().optional(),
  structureTitle: z.string().min(3, "Judul minimal 3 karakter"),
  structureDescription: z.string().min(10, "Deskripsi minimal 10 karakter"),
  structureImage: z.any().optional(),
});

export type AcademicData = z.infer<typeof AcademicDataSchema>;

const mockAcademicData = {
    id: '1',
    curriculumTitle: "Kurikulum Merdeka yang Adaptif & Inovatif",
    curriculumDescription: "SMPN 24 Padang menerapkan **Kurikulum Merdeka**, sebuah pendekatan pendidikan yang memberikan keleluasaan bagi guru untuk menciptakan pembelajaran berkualitas yang sesuai dengan kebutuhan dan minat belajar siswa. Kurikulum ini dirancang untuk menumbuhkan siswa yang kreatif, mandiri, dan bernalar kritis.\n\nKami fokus pada pembelajaran intrakurikuler yang beragam, di mana konten dioptimalkan agar siswa memiliki cukup waktu untuk mendalami konsep dan menguatkan kompetensi. Selain itu, kami mengintegrasikan **Projek Penguatan Profil Pelajar Pancasila (P5)** yang memungkinkan siswa untuk mengeksplorasi isu-isu aktual seperti lingkungan, kesehatan, dan kewirausahaan melalui pembelajaran berbasis proyek yang kolaboratif.",
    curriculumImageUrl: "https://placehold.co/1200x400.png",
    structureTitle: "Struktur Pembelajaran yang Mendukung",
    structureDescription: "Struktur pembelajaran kami dirancang untuk menciptakan lingkungan belajar yang kondusif dan terarah bagi siswa jenjang Sekolah Menengah Pertama (Kelas 7-9). Setiap kelas dibimbing oleh seorang wali kelas yang berdedikasi, yang berperan sebagai fasilitator utama dan jembatan komunikasi antara sekolah, siswa, dan orang tua.\n\nWali kelas bekerja sama dengan tim guru mata pelajaran yang ahli di bidangnya untuk memastikan setiap siswa mendapatkan perhatian yang dibutuhkan, baik secara akademik maupun personal. Pendekatan ini memungkinkan kami untuk memantau perkembangan siswa secara holistik dan memberikan dukungan yang tepat waktu untuk membantu mereka mencapai potensi maksimal.",
    structureImageUrl: "https://placehold.co/1200x400.png",
};

export async function getAcademics() {
  return mockAcademicData;
}

export async function updateAcademics(formData: FormData) {
    console.log("Updating academics (mock):", Object.fromEntries(formData.entries()));
    return { success: true, message: 'Data akademik berhasil diperbarui (mock).' };
}
