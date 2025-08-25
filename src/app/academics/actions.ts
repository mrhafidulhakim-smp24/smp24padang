
"use server";

import { db } from '@/lib/db';
import { academics } from '@/lib/db/schema';

export async function getAcademics() {
  const academicsData = await db.select().from(academics).limit(1);
  return academicsData[0] || null;
}
