
"use server";

import { StaffSchema } from "./schema";

const mockStaff = [
    { id: '1', name: 'Dr. H. Mardan, M.Pd.', position: 'Kepala Sekolah', subject: 'Manajerial', imageUrl: 'https://placehold.co/150x150.png', createdAt: new Date() },
    { id: '2', name: 'Dra. Hj. Rita Hayati', position: 'Wakil Kepala Sekolah', subject: 'Kurikulum', imageUrl: 'https://placehold.co/150x150.png', createdAt: new Date() },
    { id: '3', name: 'Budi Santoso, S.Pd.', position: 'Guru', subject: 'Matematika', homeroomOf: 'Kelas 9A', imageUrl: 'https://placehold.co/150x150.png', createdAt: new Date() },
    { id: '4', name: 'Siti Aminah, S.Kom.', position: 'Guru', subject: 'Informatika', homeroomOf: 'Kelas 8B', imageUrl: 'https://placehold.co/150x150.png', createdAt: new Date() },
];

export async function createStaff(formData: FormData) {
    console.log("Creating staff (mock)", Object.fromEntries(formData));
    return { success: true, message: "Staf berhasil ditambahkan (mock)." };
}

export async function updateStaff(id: string, currentImageUrl: string | null, formData: FormData) {
    console.log(`Updating staff ${id} (mock)`, Object.fromEntries(formData));
    return { success: true, message: "Data staf berhasil diperbarui (mock)." };
}


export async function deleteStaff(id: string, imageUrl: string | null) {
    console.log(`Deleting staff ${id} (mock)`);
    return { success: true, message: 'Data staf berhasil dihapus (mock).' };
}

export async function getStaff() {
    return mockStaff;
}
