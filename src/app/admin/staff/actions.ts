
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { Prisma } from "@prisma/client";
import { StaffSchema } from "./schema";

async function uploadImage(image: File) {
  const blob = await put(image.name, image, {
    access: "public",
  });
  return blob.url;
}

export async function createStaff(formData: FormData) {
  const validatedFields = StaffSchema.safeParse({
    name: formData.get("name"),
    position: formData.get("position"),
    subject: formData.get("subject"),
    hint: formData.get("hint"),
  });

  if (!validatedFields.success) {
    return { success: false, message: "Validasi gagal", errors: validatedFields.error.flatten().fieldErrors };
  }

  const image = formData.get("image") as File;
  let imageUrl;

  if (image && image.size > 0) {
    imageUrl = await uploadImage(image);
  }

  try {
    const newStaff = await prisma.staff.create({
      data: {
        ...validatedFields.data,
        imageUrl,
      },
    });
    revalidatePath("/admin/staff");
    revalidatePath("/profile/faculty");
    return { success: true, message: "Staf berhasil ditambahkan.", data: newStaff };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return { success: false, message: `Gagal menyimpan: ${e.message}` };
    }
    return { success: false, message: "Terjadi kesalahan pada server." };
  }
}

export async function updateStaff(id: string, currentImageUrl: string | null, formData: FormData) {
    const validatedFields = StaffSchema.safeParse({
        name: formData.get('name'),
        position: formData.get('position'),
        subject: formData.get('subject'),
        hint: formData.get('hint'),
    });

    if (!validatedFields.success) {
        return { success: false, message: 'Validasi gagal', errors: validatedFields.error.flatten().fieldErrors };
    }

    const image = formData.get('image') as File;
    let newImageUrl;

    try {
        if (image && image.size > 0) {
            if (currentImageUrl) {
                await del(currentImageUrl).catch(e => console.error("Failed to delete old image:", e));
            }
            newImageUrl = await uploadImage(image);
        }

        const updatedStaff = await prisma.staff.update({
            where: { id },
            data: {
                ...validatedFields.data,
                ...(newImageUrl && { imageUrl: newImageUrl }),
            },
        });

        revalidatePath('/admin/staff');
        revalidatePath('/profile/faculty');
        return { success: true, message: "Data staf berhasil diperbarui.", data: updatedStaff };
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return { success: false, message: `Gagal memperbarui: ${e.message}` };
        }
        return { success: false, message: 'Terjadi kesalahan pada server.' };
    }
}


export async function deleteStaff(id: string, imageUrl: string | null) {
    try {
        if (imageUrl) {
            await del(imageUrl).catch(e => console.error("Failed to delete image from blob:", e));
        }
        
        await prisma.staff.delete({
            where: { id },
        });

        revalidatePath('/admin/staff');
        revalidatePath('/profile/faculty');
        return { success: true, message: 'Data staf berhasil dihapus.' };
    } catch (e) {
         if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return { success: false, message: `Gagal menghapus: ${e.message}` };
        }
        return { success: false, message: 'Terjadi kesalahan pada server.' };
    }
}

export async function getStaff() {
    return prisma.staff.findMany({
        orderBy: { createdAt: 'asc' },
    });
}
