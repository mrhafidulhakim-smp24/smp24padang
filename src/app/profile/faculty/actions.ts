'use server';

import { db } from '@/lib/db';
import { staff } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';

export async function getFaculty() {
    try {
        // Mengambil semua staf dan mengurutkannya berdasarkan urutan kustom jika perlu
        const faculty = await db.select().from(staff).orderBy(asc(staff.id));
        return faculty;
    } catch (error) {
        console.error('Error fetching faculty:', error);
        return [];
    }
}