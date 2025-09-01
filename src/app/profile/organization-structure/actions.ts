'use server';

import { db } from '@/lib/db';

export async function getOrganizationStructures() {
    try {
        return await db.query.organizationStructures.findMany();
    } catch (error) {
        console.error('Error fetching organization structures:', error);
        return [];
    }
}
