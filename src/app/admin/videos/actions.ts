"use server";

import { db } from "@/lib/db";
import { videos } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteVideo(id: number) {
  try {
    await db.delete(videos).where(eq(videos.id, id));
    revalidatePath("/admin/videos");
    return { message: "Video deleted successfully" };
  } catch (error) {
    return { error: "Failed to delete video" };
  }
}