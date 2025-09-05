"use server";

import { db } from "@/lib/db";
import { videos } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { videoSchema } from "./schema";

export async function createVideo(prevState: any, formData: FormData) {
    const validatedFields = videoSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        youtubeUrl: formData.get("youtubeUrl"),
    });

    if (!validatedFields.success) {
        return { error: "Invalid fields", message: "" };
    }

    try {
        await db.insert(videos).values(validatedFields.data);
        revalidatePath("/admin/videos");
        return { message: "Video created successfully", error: undefined };
    } catch (error) {
        return { error: "Failed to create video", message: "" };
    }
}

export async function updateVideo(id: number, prevState: any, formData: FormData) {
    const validatedFields = videoSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        youtubeUrl: formData.get("youtubeUrl"),
    });

    if (!validatedFields.success) {
        return { error: "Invalid fields", message: "" };
    }

    try {
        await db.update(videos).set(validatedFields.data).where(eq(videos.id, id));
        revalidatePath("/admin/videos");
        return { message: "Video updated successfully", error: undefined };
    } catch (error) {
        return { error: "Failed to update video", message: "" };
    }
}

export async function deleteVideo(id: number) {
  try {
    await db.delete(videos).where(eq(videos.id, id));
    revalidatePath("/admin/videos");
    return { message: "Video deleted successfully" };
  } catch (error) {
    return { error: "Failed to delete video" };
  }
}