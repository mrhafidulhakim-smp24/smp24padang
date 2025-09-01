'use server';

import { db } from '@/lib/db';
import { staff } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';

export async function getStaff() {
    return await db.select().from(staff).orderBy(asc(staff.createdAt));
}
