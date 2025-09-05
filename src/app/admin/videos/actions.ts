'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { videos } from '@/lib/db/schema';
import { videoSchema } from './schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export async function createVideo(formData: FormData) {
  const validatedFields = videoSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    youtubeUrl: formData.get('youtubeUrl'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await db.insert(videos).values(validatedFields.data);
    revalidatePath('/admin/videos');
    return {
      message: 'Video created successfully.',
    };
  } catch (error) {
    return { error: 'Failed to create video.' };
  }
}

export async function updateVideo(id: number, formData: FormData) {
  const validatedFields = videoSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    youtubeUrl: formData.get('youtubeUrl'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await db.update(videos).set(validatedFields.data).where(eq(videos.id, id));
    revalidatePath('/admin/videos');
    return {
      message: 'Video updated successfully.',
    };
  } catch (error) {
    return { error: 'Failed to update video.' };
  }
}

export async function deleteVideo(id: number) {
  try {
    await db.delete(videos).where(eq(videos.id, id));
    revalidatePath('/admin/videos');
    return {
      message: 'Video deleted successfully.',
    };
  } catch (error) {
    return { error: 'Failed to delete video.' };
  }
}
