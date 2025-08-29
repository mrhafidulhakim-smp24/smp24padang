'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { uniforms } from '@/lib/db/schema';
import { eq, max } from 'drizzle-orm';
import { put } from '@vercel/blob';

export async function createUniform(formData: FormData) {
  const day = formData.get('day') as string;
  const description = formData.get('description') as string;
  const imageFile = formData.get('image') as File | null;

  if (!day || !description) {
    return { success: false, message: 'Day and description are required.' };
  }

  let imageUrl: string | undefined;

  if (imageFile && imageFile.size > 0) {
    try {
      const blob = await put(imageFile.name, imageFile, {
        access: 'public',
      });
      imageUrl = blob.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return { success: false, message: 'Failed to upload image.' };
    }
  }

  try {
    // Get the current maximum ID
    const maxIdResult = await db.select({ value: max(uniforms.id) }).from(uniforms);
    const newId = (maxIdResult[0]?.value || 0) + 1;

    await db.insert(uniforms).values({
      id: newId,
      day,
      description,
      image: imageUrl,
    });

    revalidatePath('/admin/profile/uniform');
    revalidatePath('/profile/uniform');
    return { success: true, message: 'Uniform created successfully.' };
  } catch (error) {
    console.error("Error creating uniform:", error);
    return { success: false, message: 'Failed to create uniform.' };
  }
}

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