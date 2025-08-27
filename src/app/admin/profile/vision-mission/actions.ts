
"use server";

import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";



export async function updateVisionMission(vision: string, mission: string) {
  try {
    const existingProfile = await db.select().from(profiles).limit(1);

    if (existingProfile.length > 0) {
      await db
        .update(profiles)
        .set({ vision, mission, updatedAt: new Date() })
        .where(eq(profiles.id, existingProfile[0].id));
    } else {
      // If no profile exists, create a new one.
      // You might want to generate a unique ID here, or use a fixed one if only one profile is expected.
      // For simplicity, let's use a fixed ID for now, assuming only one profile entry.
      await db.insert(profiles).values({
        id: "main-profile", // Using a fixed ID for the single profile entry
        vision,
        mission,
        principalName: "Default Principal", // Provide default values for other required fields
        principalWelcome: "Welcome",
        history: "History goes here",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    revalidatePath("/admin/profile/vision-mission");
    revalidatePath("/profile/vision-mission");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating vision and mission:", error);
    return { success: false, error: "Failed to update vision and mission." };
  }
}
