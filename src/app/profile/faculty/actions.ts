
"use server";

const mockStaff = [
    { id: '1', name: 'Dr. H. Mardan, M.Pd.', position: 'Kepala Sekolah', subject: 'Manajerial', imageUrl: 'https://placehold.co/150x150.png', createdAt: new Date() },
    { id: '2', name: 'Dra. Hj. Rita Hayati', position: 'Wakil Kepala Sekolah', subject: 'Kurikulum', imageUrl: 'https://placehold.co/150x150.png', createdAt: new Date() },
    { id: '3', name: 'Budi Santoso, S.Pd.', position: 'Guru', subject: 'Matematika', imageUrl: 'https://placehold.co/150x150.png', createdAt: new Date() },
    { id: '4', name: 'Siti Aminah, S.Kom.', position: 'Guru', subject: 'Informatika', imageUrl: 'https://placehold.co/150x150.png', createdAt: new Date() },
    { id: '5', name: 'Ahmad Dahlan, S.S.', position: 'Guru', subject: 'Bahasa Indonesia', imageUrl: 'https://placehold.co/150x150.png', createdAt: new Date() },
    { id: '6', name: 'Dewi Lestari, S.Pd.', position: 'Guru', subject: 'Bahasa Inggris', imageUrl: 'https://placehold.co/150x150.png', createdAt: new Date() },
];


export async function getStaff() {
  return mockStaff;
}
