
"use server";

// Mock data, as Prisma is removed.
const mockBanners = [
  { id: '1', title: 'Selamat Datang di SMPN 24 Padang', description: 'Sekolah unggul yang berdedikasi untuk membentuk generasi masa depan yang cerdas, kreatif, dan berkarakter.', imageUrl: 'https://placehold.co/1920x1080.png', createdAt: new Date() },
  { id: '2', title: 'Penerimaan Siswa Baru 2024/2025', description: 'Bergabunglah dengan komunitas kami dan mulailah perjalanan pendidikan Anda.', imageUrl: 'https://placehold.co/1920x1080.png', createdAt: new Date() },
];

const mockAnnouncements = [
    { id: 'ann1', title: 'Penerimaan Peserta Didik Baru (PPDB) 2024/2025 Telah Dibuka!', date: new Date('2024-06-15'), description: 'Jangan lewatkan kesempatan untuk menjadi bagian dari keluarga besar SMPN 24 Padang. Pendaftaran dibuka hingga 15 Juli 2024. Klik untuk info selengkapnya.' },
    { id: 'ann2', title: 'Jadwal Ujian Akhir Semester Genap', date: new Date('2024-06-10'), description: 'Ujian Akhir Semester (UAS) Genap akan dilaksanakan mulai tanggal 20 hingga 27 Juni 2024. Pastikan untuk mempersiapkan diri dengan baik.' },
    { id: 'ann3', title: 'Libur Sekolah dan Pembagian Rapor', date: new Date('2024-06-08'), description: 'Pembagian rapor akan dilaksanakan pada tanggal 29 Juni 2024, diikuti dengan libur akhir tahun ajaran.' },
];

const mockNews = [
    { id: '1', title: 'Lomba Cerdas Cermat Tingkat Kota', description: 'Siswa kami berhasil meraih juara 2 dalam Lomba Cerdas Cermat tingkat kota Padang. Prestasi ini merupakan buah dari kerja keras dan bimbingan para guru.', date: new Date('2023-11-15'), imageUrl: 'https://placehold.co/600x400.png' },
    { id: '2', title: 'Kegiatan Jumat Bersih Lingkungan Sekolah', description: 'Dalam rangka menumbuhkan kepedulian terhadap lingkungan, kami mengadakan kegiatan Jumat Bersih yang diikuti oleh seluruh siswa dan guru.', date: new Date('2023-11-10'), imageUrl: 'https://placehold.co/600x400.png' },
    { id: '3', title: 'Peringatan Hari Pahlawan 10 November', description: 'Upacara bendera dan berbagai lomba diadakan untuk memperingati jasa para pahlawan yang telah berjuang untuk kemerdekaan Indonesia.', date: new Date('2023-11-08'), imageUrl: 'https://placehold.co/600x400.png' },
];

const mockProfile = {
    id: '1',
    principalName: 'Hasyuni Harti M.Pd',
    principalWelcome: "Assalamualaikum Warahmatullah Wabarakatuh.\n\nSelamat datang di situs web resmi SMP Negeri 24 Padang. Platform digital ini kami hadirkan sebagai gerbang informasi utama dan jembatan komunikasi antara sekolah dengan seluruh warga sekolah, orang tua, serta masyarakat luas.\n\nDi era digital ini, kami berkomitmen untuk terus beradaptasi dan berinovasi demi menciptakan lingkungan pendidikan yang dinamis dan relevan. Melalui situs ini, kami berharap dapat menyajikan gambaran utuh tentang keunggulan akademik, kekayaan kegiatan ekstrakurikuler, serta berbagai prestasi yang menjadi kebanggaan kita bersama.\n\nMari kita manfaatkan platform ini untuk bersinergi, berkolaborasi, dan bersama-sama mengantarkan para siswa menjadi generasi penerus bangsa yang cerdas, berkarakter, dan siap menghadapi tantangan global. Terima kasih atas kunjungan dan dukungan Anda.\n\nWassalamualaikum Warahmatullah Wabarakatuh.",
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

export async function getAnnouncements() {
    return mockAnnouncements.slice(0, 3);
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
