
"use server";

import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getProfileDetails() {
  try {
    const result = await db.select().from(profiles).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error fetching profile details:", error);
    return null;
  }
}

type ProfileDetails = {
  principalName: string;
  principalWelcome: string;
  principalImageUrl: string;
};

export async function updateProfileDetails(details: ProfileDetails) {
  try {
    const existingProfile = await db.select().from(profiles).limit(1);

    if (existingProfile.length > 0) {
      await db
        .update(profiles)
        .set({ ...details, updatedAt: new Date() })
        .where(eq(profiles.id, existingProfile[0].id));
    } else {
      // This case is unlikely if the profile is already set up, but as a fallback:
      await db.insert(profiles).values({
        id: "main-profile",
        ...details,
        vision: "Default Vision",
        mission: "Default Mission",
        history: "Default History",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Revalidate all relevant paths
    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/admin/profile");

    return { success: true };
  } catch (error) {
    console.error("Error updating profile details:", error);
    return { success: false, error: "Failed to update profile details." };
  }
}
