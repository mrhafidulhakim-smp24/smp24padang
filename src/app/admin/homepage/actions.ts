"use server";

import { v4 as uuidv4 } from 'uuid';
import { db } from "@/lib/db";
import {
  banners,
  facilities,
  statistics,
} from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { put, del } from '@vercel/blob';

// Unified data fetching
export async function getHomepageData() {
  try {
    const [bannersData, statisticsData, facilitiesData] = await Promise.all([
      db.select().from(banners).orderBy(desc(banners.createdAt)),
      db.select().from(statistics).limit(1),
      db.select().from(facilities).orderBy(desc(facilities.createdAt)),
    ]);
    return {
      banners: bannersData,
      statistics: statisticsData[0] || null,
      facilities: facilitiesData,
    };
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return { banners: [], statistics: null, facilities: [] };
  }
}

// Revalidation helper
function revalidateHomepage() {
  revalidatePath("/");
  revalidatePath("/admin/homepage");
}

// Banner Actions
export async function createBanner(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File | null;
    let imageUrl: string | null = null;

    if (imageFile && imageFile.size > 0) {
      const blob = await put(imageFile.name, imageFile, { access: 'public' });
      imageUrl = blob.url;
    }

    await db.insert(banners).values({ id: uuidv4(), title, description, imageUrl });
    revalidateHomepage();
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create banner." };
  }
}

export async function updateBanner(id: string, currentImageUrl: string | null, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File | null;
    
    const updateData: { title: string, description: string, imageUrl?: string, updatedAt: Date } = {
        title,
        description,
        updatedAt: new Date(),
    };

    if (imageFile && imageFile.size > 0) {
        if (currentImageUrl) {
            await del(currentImageUrl);
        }
        const blob = await put(imageFile.name, imageFile, { access: 'public' });
        updateData.imageUrl = blob.url;
    }

    await db.update(banners).set(updateData).where(eq(banners.id, id));
    revalidateHomepage();
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update banner." };
  }
}

export async function deleteBanner(id: string, imageUrl: string | null) {
  try {
    if (imageUrl) {
        await del(imageUrl);
    }
    await db.delete(banners).where(eq(banners.id, id));
    revalidateHomepage();
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete banner." };
  }
}

// Statistics Actions
export async function updateStatistics(data: { classrooms: number; students: number; teachers: number; staff: number; }) {
  try {
    const existingStats = await db.select().from(statistics).limit(1);
    if (existingStats.length > 0) {
      await db.update(statistics).set({ ...data, updatedAt: new Date() }).where(eq(statistics.id, existingStats[0].id));
    } else {
      await db.insert(statistics).values({ id: uuidv4(), ...data });
    }
    revalidateHomepage();
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update statistics." };
  }
}

// Facility Actions
export async function createFacility(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const imageFile = formData.get('image') as File | null;
    let imageUrl: string | null = null;

    if (imageFile && imageFile.size > 0) {
      const blob = await put(imageFile.name, imageFile, { access: 'public' });
      imageUrl = blob.url;
    }

    if (!imageUrl) {
        return { success: false, error: "Image is required." };
    }

    await db.insert(facilities).values({ id: uuidv4(), name, imageUrl });
    revalidateHomepage();
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create facility." };
  }
}

export async function updateFacility(id: string, currentImageUrl: string | null, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const imageFile = formData.get('image') as File | null;
    
    const updateData: { name: string, imageUrl?: string, updatedAt: Date } = {
        name,
        updatedAt: new Date(),
    };

    if (imageFile && imageFile.size > 0) {
        if (currentImageUrl) {
            await del(currentImageUrl);
        }
        const blob = await put(imageFile.name, imageFile, { access: 'public' });
        updateData.imageUrl = blob.url;
    }

    await db.update(facilities).set(updateData).where(eq(facilities.id, id));
    revalidateHomepage();
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update facility." };
  }
}

export async function deleteFacility(id: string, imageUrl: string | null) {
  try {
    if (imageUrl) {
        await del(imageUrl);
    }
    await db.delete(facilities).where(eq(facilities.id, id));
    revalidateHomepage();
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete facility." };
  }
}