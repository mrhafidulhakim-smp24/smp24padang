
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
    principalName: 'Hasyuni Harti M.Pd',
    principalWelcome: "Bismillahirohmannirrohim\n\nAssalamualaikum Warahmatullah Wabarakatuh\n\nKami mengucapkan selamat datang di Website kami SMP Negeri 24 Padang yang saya tujukan untuk seluruh unsur pimpinan, guru, karyawan dan siswa masyarakat guna dapat mengakses seluruh informasi tentang segala profil, aktifitas/kegiatan serta fasilitas sekolah kami.\n\nKami selaku pimpinan sekolah mengucapkan terima kasih kepada tim pembuat Website ini yang telah berusaha untuk dapat lebih memperkenalkan segala perihal yang dimiliki oleh sekolah. Dan tentunya Website sekolah kami masih terdapat banyak kekurangan, oleh karena itu kepada seluruh civitas akademika dan masyarakat umum dapat memberikan saran dan kritik yang membangun demi kemajuan Website ini lebih lanjut.\n\nSaya berharap Website ini dapat dijadikan sarana interaksi yang positif baik antar warga sekolah maupun masyarakat pada umumnya sehingga sehingga informasi dapat tersampaikan dengan baik. Semoga Allah SWT memberikan kekuatan bagi kita semua untuk mencerdaskan anak-anak bangsa.\n\nWassalamualikum Warahmatullah Wabarakatuh",
    principalImageUrl: 'https://placehold.co/600x800.png',
};

const mockStatistics = {
    classrooms: 24,
    students: 773,
    teachers: 30,
    staff: 12,
};

const mockFacilities = [
    { id: '1', name: 'Laboratorium Komputer', imageUrl: 'https://placehold.co/600x400.png' },
    { id: '2', name: 'Perpustakaan', imageUrl: 'https://placehold.co/600x400.png' },
    { id: '3', name: 'Lapangan Olahraga', imageUrl: 'https://placehold.co/600x400.png' },
];

const mockAbout = {
    history: "Didirikan dengan semangat untuk mencerdaskan kehidupan bangsa, SMPN 24 Padang telah menjadi pilar pendidikan di komunitas kami selama beberapa dekade. Kami berkomitmen untuk terus berinovasi dalam metode pengajaran dan fasilitas, memastikan setiap siswa mendapatkan pengalaman belajar terbaik. Pengakuan sebagai Sekolah Adiwiyata Nasional menjadi bukti nyata dedikasi kami dalam menciptakan lingkungan belajar yang tidak hanya unggul secara akademik, tetapi juga peduli dan berbudaya lingkungan.",
    vision: "Menjadi lembaga pendidikan terkemuka yang diakui karena memberdayakan siswa untuk menjadi warga dunia yang welas asih, inovatif, dan bertanggung jawab.",
    mission: [
        "Menyediakan pendidikan berkualitas tinggi dan komprehensif yang memupuk rasa ingin tahu intelektual.",
        "Membina budaya saling menghormati, berintegritas, dan bertanggung jawab sosial.",
        "Membekali siswa dengan keterampilan dan pola pikir untuk berhasil di dunia yang cepat berubah.",
        "Menciptakan komunitas siswa, orang tua, dan pendidik yang kolaboratif dan inklusif.",
    ],
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

export async function getStatistics() {
    return mockStatistics;
}

export async function getFacilities() {
    return mockFacilities;
}

export async function getAbout() {
    return mockAbout;
}
