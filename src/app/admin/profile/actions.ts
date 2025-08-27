"use server";

import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { put, del } from '@vercel/blob'; // Import put and del

export async function getProfileDetails() {
  try {
    const result = await db.select().from(profiles).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error fetching profile details:", error);
    return null;
  }
}

export async function updateProfileDetails(formData: FormData) {
  try {
    const principalName = formData.get('principalName') as string;
    const principalWelcome = formData.get('principalWelcome') as string;
    const imageFile = formData.get('principalImage') as File | null; // Use a new name for the file input
    const currentImageUrl = formData.get('currentPrincipalImageUrl') as string | null; // Pass current image URL from client

    let newImageUrl: string | null = currentImageUrl;

    if (imageFile && imageFile.size > 0) {
      // Delete old image if it exists
      if (currentImageUrl) {
        await del(currentImageUrl);
      }
      const blob = await put(imageFile.name, imageFile, { access: 'public' });
      newImageUrl = blob.url;
    }

    const existingProfile = await db.select().from(profiles).limit(1);

    const updateData: {
        principalName: string;
        principalWelcome: string;
        principalImageUrl: string | null;
        updatedAt: Date;
    } = {
        principalName,
        principalWelcome,
        principalImageUrl: newImageUrl,
        updatedAt: new Date(),
    };

    if (existingProfile.length > 0) {
      await db
        .update(profiles)
        .set(updateData)
        .where(eq(profiles.id, existingProfile[0].id));
    } else {
      // This case is unlikely if the profile is already set up, but as a fallback:
      await db.insert(profiles).values({
        id: "main-profile",
        ...updateData,
        vision: "Default Vision",
        mission: "Default Mission",
        history: "Default History",
        createdAt: new Date(),
      });
    }

    // Revalidate all relevant paths
    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/admin/profile");

    return { success: true, message: "Profil sekolah berhasil diperbarui." };
  } catch (error) {
    console.error("Error updating profile details:", error);
    return { success: false, error: "Gagal memperbarui profil sekolah." };
  }
}