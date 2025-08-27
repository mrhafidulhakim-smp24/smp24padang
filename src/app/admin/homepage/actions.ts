
"use server";

import { v4 as uuidv4 } from 'uuid';
import { db } from "@/lib/db";
import {
  banners,
  facilities,
  marquee,
  statistics,
} from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Unified data fetching
export async function getHomepageData() {
  try {
    const [bannersData, marqueeData, statisticsData, facilitiesData] = await Promise.all([
      db.select().from(banners).orderBy(desc(banners.createdAt)),
      db.select().from(marquee).orderBy(desc(marquee.createdAt)),
      db.select().from(statistics).limit(1),
      db.select().from(facilities).orderBy(desc(facilities.createdAt)),
    ]);
    return {
      banners: bannersData,
      marquee: marqueeData,
      statistics: statisticsData[0] || null,
      facilities: facilitiesData,
    };
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return { banners: [], marquee: [], statistics: null, facilities: [] };
  }
}

// Revalidation helper
function revalidateHomepage() {
  revalidatePath("/");
  revalidatePath("/admin/homepage");
}

// Banner Actions
export async function createBanner(data: { title: string; description: string; imageUrl: string; }) {
  try {
    await db.insert(banners).values({ id: uuidv4(), ...data });
    revalidateHomepage();
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create banner." };
  }
}

export async function updateBanner(id: string, data: { title: string; description: string; imageUrl: string; }) {
  try {
    await db.update(banners).set({ ...data, updatedAt: new Date() }).where(eq(banners.id, id));
    revalidateHomepage();
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update banner." };
  }
}

export async function deleteBanner(id: string) {
  try {
    await db.delete(banners).where(eq(banners.id, id));
    revalidateHomepage();
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete banner." };
  }
}

// Marquee Actions
export async function createMarqueeItem(data: { type: 'Berita' | 'Prestasi' | 'Pengumuman'; text: string; }) {
  try {
    await db.insert(marquee).values({ id: uuidv4(), ...data });
    revalidateHomepage();
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create marquee item." };
  }
}

export async function updateMarqueeItem(id: string, data: { type: 'Berita' | 'Prestasi' | 'Pengumuman'; text: string; }) {
  try {
    await db.update(marquee).set(data).where(eq(marquee.id, id));
    revalidateHomepage();
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update marquee item." };
  }
}

export async function deleteMarqueeItem(id: string) {
  try {
    await db.delete(marquee).where(eq(marquee.id, id));
    revalidateHomepage();
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete marquee item." };
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
export async function createFacility(data: { name: string; imageUrl: string; }) {
  try {
    await db.insert(facilities).values({ id: uuidv4(), ...data });
    revalidateHomepage();
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create facility." };
  }
}

export async function updateFacility(id: string, data: { name: string; imageUrl: string; }) {
  try {
    await db.update(facilities).set({ ...data, updatedAt: new Date() }).where(eq(facilities.id, id));
    revalidateHomepage();
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update facility." };
  }
}

export async function deleteFacility(id: string) {
  try {
    await db.delete(facilities).where(eq(facilities.id, id));
    revalidateHomepage();
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete facility." };
  }
}
