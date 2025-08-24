
"use server";

import { z } from "zod";

export const NewsArticleSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  date: z.coerce.date({
    errorMap: () => ({ message: "Format tanggal tidak valid" }),
  }),
});

const mockNews = [
    { id: '1', title: 'Lomba Cerdas Cermat Tingkat Kota', description: 'Siswa kami berhasil meraih juara 2 dalam Lomba Cerdas Cermat tingkat kota Padang. Prestasi ini merupakan buah dari kerja keras dan bimbingan para guru.', date: new Date('2023-11-15'), imageUrl: 'https://placehold.co/600x400.png', createdAt: new Date(), updatedAt: new Date() },
    { id: '2', title: 'Kegiatan Jumat Bersih Lingkungan Sekolah', description: 'Dalam rangka menumbuhkan kepedulian terhadap lingkungan, kami mengadakan kegiatan Jumat Bersih yang diikuti oleh seluruh siswa dan guru.', date: new Date('2023-11-10'), imageUrl: 'https://placehold.co/600x400.png', createdAt: new Date(), updatedAt: new Date() },
    { id: '3', title: 'Peringatan Hari Pahlawan 10 November', description: 'Upacara bendera dan berbagai lomba diadakan untuk memperingati jasa para pahlawan yang telah berjuang untuk kemerdekaan Indonesia.', date: new Date('2023-11-08'), imageUrl: 'https://placehold.co/600x400.png', createdAt: new Date(), updatedAt: new Date() },
];


export async function createNewsArticle(formData: FormData) {
    console.log("Creating news article (mock):", Object.fromEntries(formData.entries()));
    return { success: true, message: 'Artikel berhasil dibuat (mock).' };
}

export async function updateNewsArticle(id: string, currentImageUrl: string | null, formData: FormData) {
    console.log(`Updating news article ${id} (mock):`, Object.fromEntries(formData.entries()));
    return { success: true, message: "Artikel berhasil diperbarui (mock)." };
}

export async function deleteNewsArticle(id: string, imageUrl: string | null) {
    console.log(`Deleting news article ${id} (mock)`);
    return { success: true, message: 'Berita berhasil dihapus (mock).' };
}

export async function getNewsForAdmin() {
    return mockNews;
}
