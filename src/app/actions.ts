
"use server";

// Mock data, as Prisma is removed.
const mockBanners = [
  { id: '1', title: 'Selamat Datang di SMPN 24 Padang', description: 'Sekolah unggul yang berdedikasi untuk membentuk generasi masa depan yang cerdas, kreatif, dan berkarakter.', imageUrl: 'https://placehold.co/1920x1080.png', createdAt: new Date() },
  { id: '2', title: 'Penerimaan Siswa Baru 2024/2025', description: 'Bergabunglah dengan komunitas kami dan mulailah perjalanan pendidikan Anda.', imageUrl: 'https://placehold.co/1920x1080.png', createdAt: new Date() },
];

const mockNews = [
    { id: '1', title: 'Lomba Cerdas Cermat Tingkat Kota', description: 'Siswa kami berhasil meraih juara 2 dalam Lomba Cerdas Cermat tingkat kota Padang. Prestasi ini merupakan buah dari kerja keras dan bimbingan para guru.', date: new Date('2023-11-15'), imageUrl: 'https://placehold.co/600x400.png' },
    { id: '2', title: 'Kegiatan Jumat Bersih Lingkungan Sekolah', description: 'Dalam rangka menumbuhkan kepedulian terhadap lingkungan, kami mengadakan kegiatan Jumat Bersih yang diikuti oleh seluruh siswa dan guru.', date: new Date('2023-11-10'), imageUrl: 'https://placehold.co/600x400.png' },
    { id: '3', title: 'Peringatan Hari Pahlawan 10 November', description: 'Upacara bendera dan berbagai lomba diadakan untuk memperingati jasa para pahlawan yang telah berjuang untuk kemerdekaan Indonesia.', date: new Date('2023-11-08'), imageUrl: 'https://placehold.co/600x400.png' },
];

const mockProfile = {
    id: '1',
    principalName: 'Drs. H. Mardan, M.Pd.',
    principalWelcome: "Assalamualaikum Wr. Wb.\n\nSelamat datang di situs resmi SMPN 24 Padang. Kami bangga menjadi lembaga pendidikan yang berkomitmen untuk memberikan pendidikan berkualitas yang tidak hanya berfokus pada keunggulan akademik, tetapi juga pada pengembangan karakter, kreativitas, dan tanggung jawab sosial. Di SMPN 24 Padang, kami percaya bahwa setiap siswa memiliki potensi unik yang perlu digali dan dikembangkan. Melalui lingkungan belajar yang mendukung, inovatif, dan berakar pada nilai-nilai luhur, kami berusaha untuk memberdayakan siswa-siswi kami menjadi individu yang percaya diri, kritis, dan siap menghadapi tantangan masa depan. Kami mengundang Anda untuk menjelajahi situs web kami dan mengenal lebih dekat tentang program, prestasi, dan semangat komunitas sekolah kami. Terima kasih atas kunjungan Anda.",
    principalImageUrl: 'https://placehold.co/600x800.png',
};

export async function getBanners() {
  return mockBanners;
}

export async function getLatestNews() {
  return mockNews.slice(0, 3);
}

export async function getProfile() {
    return mockProfile;
}
