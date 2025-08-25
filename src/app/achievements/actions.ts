
"use server";
import { db } from '@/lib/db';
import { achievements } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function getAchievements() {
  return await db.select().from(achievements).orderBy(desc(achievements.createdAt));
}
