'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { profiles, pastPrincipals } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { put, del } from '@vercel/blob';
import { z } from 'zod';

const profileSchema = z.object({
    principalName: z.string().min(1, 'Nama tidak boleh kosong'),
    principalWelcome: z.string().min(1, 'Sambutan tidak boleh kosong'),
    history: z.string().min(1, 'Sejarah tidak boleh kosong'),
    principalImage: z.instanceof(File).optional(),
});

export async function updatePrincipalProfile(formData: FormData) {
    const validatedFields = profileSchema.safeParse(
        Object.fromEntries(formData.entries()),
    );

    if (!validatedFields.success) {
        return { success: false, message: 'Validasi gagal' };
    }

    const { principalName, principalWelcome, history, principalImage } =
        validatedFields.data;

    const existingProfile = await db.query.profiles.findFirst();
    const profileId = existingProfile?.id || '1';

    let newImageUrl: string | undefined;

    if (principalImage && principalImage.size > 0) {
        try {
            if (existingProfile?.principalImageUrl) {
                await del(existingProfile.principalImageUrl);
            }
            const blob = await put(principalImage.name, principalImage, {
                access: 'public',
            });
            newImageUrl = blob.url;
        } catch (error) {
            return { success: false, message: 'Gagal unggah gambar' };
        }
    }

    try {
        if (existingProfile) {
            await db
                .update(profiles)
                .set({
                    principalName,
                    principalWelcome,
                    history,
                    principalImageUrl:
                        newImageUrl ?? existingProfile.principalImageUrl,
                    updatedAt: new Date(),
                })
                .where(eq(profiles.id, profileId));
        } else {
            await db.insert(profiles).values({
                id: profileId,
                principalName,
                principalWelcome,
                history,
                principalImageUrl: newImageUrl,
                vision: '',
                mission: '',
            });
        }
        revalidatePath('/admin/profile/principal');
        revalidatePath('/');
        revalidatePath('/profile');
        return {
            success: true,
            message: 'Profil berhasil diperbarui.',
            newImageUrl,
        };
    } catch (error) {
        return { success: false, message: 'Gagal perbarui profil.' };
    }
}

const pastPrincipalSchema = z.object({
    name: z.string().min(1, 'Nama tidak boleh kosong'),
    period: z.string().min(1, 'Periode tidak boleh kosong'),
    image: z.instanceof(File).optional(),
});

export async function createPastPrincipal(formData: FormData) {
    const validatedFields = pastPrincipalSchema.safeParse(
        Object.fromEntries(formData.entries()),
    );

    if (!validatedFields.success) {
        return { success: false, message: 'Validasi gagal' };
    }

    const { name, period, image } = validatedFields.data;
    let imageUrl: string | undefined;

    if (image && image.size > 0) {
        try {
            const blob = await put(image.name, image, { access: 'public' });
            imageUrl = blob.url;
        } catch (error) {
            return { success: false, message: 'Gagal unggah gambar' };
        }
    }

    try {
        await db.insert(pastPrincipals).values({ name, period, imageUrl });
        revalidatePath('/admin/profile/principal');
        revalidatePath('/profile');
        return {
            success: true,
            message: 'Riwayat kepala sekolah ditambahkan.',
        };
    } catch (error) {
        return { success: false, message: 'Gagal menambahkan data.' };
    }
}

export async function updatePastPrincipal(
    id: number,
    currentImageUrl: string | null,
    formData: FormData,
) {
    const validatedFields = pastPrincipalSchema.safeParse(
        Object.fromEntries(formData.entries()),
    );

    if (!validatedFields.success) {
        return { success: false, message: 'Validasi gagal' };
    }

    const { name, period, image } = validatedFields.data;
    let newImageUrl: string | undefined;

    if (image && image.size > 0) {
        try {
            if (currentImageUrl) {
                await del(currentImageUrl);
            }
            const blob = await put(image.name, image, { access: 'public' });
            newImageUrl = blob.url;
        } catch (error) {
            return { success: false, message: 'Gagal unggah gambar' };
        }
    }

    try {
        await db
            .update(pastPrincipals)
            .set({
                name,
                period,
                imageUrl: newImageUrl ?? currentImageUrl,
            })
            .where(eq(pastPrincipals.id, id));
        revalidatePath('/admin/profile/principal');
        revalidatePath('/profile');
        return { success: true, message: 'Riwayat kepala sekolah diperbarui.' };
    } catch (error) {
        return { success: false, message: 'Gagal memperbarui data.' };
    }
}

export async function deletePastPrincipal(id: number, imageUrl: string | null) {
    try {
        if (imageUrl) {
            await del(imageUrl);
        }
        await db.delete(pastPrincipals).where(eq(pastPrincipals.id, id));
        revalidatePath('/admin/profile/principal');
        revalidatePath('/profile');
        return { success: true, message: 'Data berhasil dihapus.' };
    } catch (error) {
        return { success: false, message: 'Gagal menghapus data.' };
    }
}
