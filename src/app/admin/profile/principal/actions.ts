'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { put } from '@vercel/blob';

export async function updatePrincipalProfile(formData: FormData) {

  const principalName = formData.get('principalName') as string;
  const principalWelcome = formData.get('principalWelcome') as string;
  const principalImageFile = formData.get('principalImage') as File;

  let principalImageUrl: string | undefined;

  // Fetch the existing profile to get its ID (assuming only one principal profile)
  const existingProfile = await db.query.profiles.findFirst();
  const profileId = existingProfile?.id || '1'; // Use existing ID or a default if none exists

  if (principalImageFile && principalImageFile.size > 0) {
    try {
      const blob = await put(principalImageFile.name, principalImageFile, {
        access: 'public',
      });
      principalImageUrl = blob.url;
    } catch (error) {
      console.error("Error uploading principal image to Vercel Blob:", error);
      throw new Error("Failed to upload principal image.");
    }
  }

  try {
    if (existingProfile) {
      // Update existing profile
      await db.update(profiles)
        .set({
          principalName,
          principalWelcome,
          ...(principalImageUrl && { principalImageUrl }),
          updatedAt: new Date(),
        })
        .where(eq(profiles.id, profileId));
    } else {
      // Insert new profile if none exists
      await db.insert(profiles).values({
        id: profileId,
        principalName,
        principalWelcome,
        principalImageUrl: principalImageUrl || '',
        history: '', // Placeholder, as history is not managed here
        vision: '', // Placeholder
        mission: '', // Placeholder
      });
    }

    revalidatePath('/admin/profile/principal');
    revalidatePath('/'); // Revalidate homepage as well
    return { success: true, message: 'Principal profile updated successfully.' };
  } catch (error) {
    console.error("Error updating principal profile in DB:", error);
    return { success: false, message: 'Failed to update principal profile.' };
  }
}