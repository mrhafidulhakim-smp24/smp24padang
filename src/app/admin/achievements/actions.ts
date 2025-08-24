
"use server";

const mockAchievements = [
    { id: '1', title: 'Juara 1 Olimpiade Sains Nasional', student: 'Andi Pratama', description: 'Meraih medali emas dalam kompetisi sains paling bergengsi di Indonesia.', imageUrl: 'https://placehold.co/600x400.png', createdAt: new Date() },
    { id: '2', title: 'Juara 2 Lomba Debat Bahasa Inggris', student: 'Tim Debat Bahasa Inggris', description: 'Menunjukkan kemampuan argumentasi dan bahasa yang luar biasa di tingkat provinsi.', imageUrl: 'https://placehold.co/600x400.png', createdAt: new Date() },
    { id: '3', title: 'Pameran Seni Rupa Tingkat Kota', student: 'Siti Aisyah', description: 'Karya lukisnya terpilih untuk dipamerkan dalam pameran seni tingkat kota.', imageUrl: 'https://placehold.co/600x400.png', createdAt: new Date() },
];

export async function getAchievements() {
  return mockAchievements;
}

export async function createAchievement(formData: FormData) {
  console.log("Creating achievement (mock)", Object.fromEntries(formData));
  return { success: true, message: "Prestasi berhasil ditambahkan (mock)." };
}

export async function updateAchievement(id: string, currentImageUrl: string | null, formData: FormData) {
    console.log(`Updating achievement ${id} (mock)`, Object.fromEntries(formData));
    return { success: true, message: "Prestasi berhasil diperbarui (mock)." };
}

export async function deleteAchievement(id: string, imageUrl: string | null) {
    console.log(`Deleting achievement ${id} (mock)`);
    return { success: true, message: 'Prestasi berhasil dihapus (mock).' };
}
