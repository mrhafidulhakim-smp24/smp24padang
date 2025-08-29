'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { uniforms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { put } from '@vercel/blob';

export async function updateUniform(formData: FormData) {

  const id = formData.get('id') as string;
  const description = formData.get('description') as string;
  const imageFile = formData.get('image') as File;

  let imageUrl: string | undefined;

  if (imageFile && imageFile.size > 0) {
    try {
      const blob = await put(imageFile.name, imageFile, {
        access: 'public',
      });
      imageUrl = blob.url;
    } catch (error) {
      console.error("Error uploading image to Vercel Blob:", error);
      throw new Error("Failed to upload image.");
    }
  }

  try {
    await db.update(uniforms)
      .set({
        description: description,
        ...(imageUrl && { image: imageUrl }), // Only update image if a new one was uploaded
      })
      .where(eq(uniforms.id, parseInt(id)));

    revalidatePath('/admin/profile/uniform');
    revalidatePath('/profile/uniform');
    return { success: true, message: 'Uniform updated successfully.' };
  } catch (error) {
    console.error("Error updating uniform in DB:", error);
    return { success: false, message: 'Failed to update uniform.' };
  }
}