
"use server";

import prisma from '@/lib/prisma';
import { StaffSchema } from "./schema";
import { put, del } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

export async function createStaff(prevState: any, formData: FormData) {
    const validatedFields = StaffSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, message: "Validasi data gagal." };
    }

    const { name, position, subject, homeroomOf } = validatedFields.data;
    const imageFile = formData.get('image') as File | null;
    let imageUrl: string | null = null;

    try {
        if (imageFile && imageFile.size > 0) {
            const blob = await put(imageFile.name, imageFile, { access: 'public' });
            imageUrl = blob.url;
        }

        await prisma.staff.create({
            data: { name, position, subject, homeroomOf, imageUrl }
        });

        revalidatePath('/profile/faculty');
        revalidatePath('/admin/staff');
        return { success: true, message: "Staf berhasil ditambahkan." };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Gagal menambahkan staf." };
    }
}

export async function updateStaff(id: string, currentImageUrl: string | null, prevState: any, formData: FormData) {
    const validatedFields = StaffSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, message: "Validasi data gagal." };
    }

    const { name, position, subject, homeroomOf } = validatedFields.data;
    const imageFile = formData.get('image') as File | null;
    let newImageUrl = currentImageUrl;

    try {
        if (imageFile && imageFile.size > 0) {
            if (currentImageUrl && !currentImageUrl.includes('placehold.co')) {
                await del(currentImageUrl);
            }
            const blob = await put(imageFile.name, imageFile, { access: 'public' });
            newImageUrl = blob.url;
        }

        await prisma.staff.update({
            where: { id },
            data: { name, position, subject, homeroomOf, imageUrl: newImageUrl }
        });

        revalidatePath('/profile/faculty');
        revalidatePath('/admin/staff');
        return { success: true, message: "Data staf berhasil diperbarui." };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Gagal memperbarui data staf." };
    }
}


export async function deleteStaff(id: string, imageUrl: string | null) {
    try {
        if (imageUrl && !imageUrl.includes('placehold.co')) {
            await del(imageUrl);
        }
        await prisma.staff.delete({ where: { id } });
        
        revalidatePath('/profile/faculty');
        revalidatePath('/admin/staff');
        return { success: true, message: 'Data staf berhasil dihapus.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Gagal menghapus data staf.' };
    }
}

export async function getStaff() {
    return await prisma.staff.findMany({
        orderBy: { createdAt: 'asc' }
    });
}
