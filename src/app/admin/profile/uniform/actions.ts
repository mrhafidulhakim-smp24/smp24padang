'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { uniforms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { put, del } from '@vercel/blob';
import { z } from 'zod';

// Schema for validating the form data when updating a uniform.
const uniformUpdateSchema = z.object({
  description: z.string().min(1, 'Deskripsi tidak boleh kosong'),
  image: z.instanceof(File).optional(), // Image is optional
});

/**
 * Updates a uniform's details, including optionally updating its image.
 * @param id The ID of the uniform to update.
 * @param formData The form data from the client.
 * @returns An object indicating success or failure, with a message and the new image URL if updated.
 */
export async function updateUniform(id: number, formData: FormData) {
  const validatedFields = uniformUpdateSchema.safeParse({
    description: formData.get('description'),
    image: formData.get('image'),
  });

  // Validate the form data
  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validasi gagal: ' + validatedFields.error.flatten().fieldErrors.description?.join(', '),
    };
  }

  const { description, image } = validatedFields.data;

  // Find the existing uniform record
  const existingUniform = await db.query.uniforms.findFirst({
    where: eq(uniforms.id, id),
  });

  if (!existingUniform) {
    return { success: false, message: 'Seragam tidak ditemukan.' };
  }

  let newImageUrl: string | undefined = undefined;

  // Handle image upload if a new image is provided
  if (image && image.size > 0) {
    try {
      // Delete the old image from Vercel Blob if it exists
      if (existingUniform.image) {
        await del(existingUniform.image);
      }
      // Upload the new image
      const blob = await put(image.name, image, { access: 'public' });
      newImageUrl = blob.url;
    } catch (error) {
      console.error("Error during image upload:", error);
      return { success: false, message: 'Gagal mengunggah gambar baru.' };
    }
  }

  // Update the database record
  try {
    await db
      .update(uniforms)
      .set({
        description,
        // Use the new image URL if available, otherwise keep the existing one
        image: newImageUrl ?? existingUniform.image,
        updatedAt: new Date(), // Set the updated timestamp
      })
      .where(eq(uniforms.id, id));

    // Revalidate paths to ensure the frontend shows the updated data
    revalidatePath('/admin/profile/uniform');
    revalidatePath('/profile/uniform');

    return {
      success: true,
      message: 'Seragam berhasil diperbarui.',
      updatedImage: newImageUrl ?? existingUniform.image, // Return the final image URL
    };
  } catch (error) {
    console.error("Error updating uniform in DB:", error);
    return { success: false, message: 'Gagal memperbarui seragam di database.' };
  }
}