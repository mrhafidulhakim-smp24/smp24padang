'use server';

import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateVisionMission(vision: string, mission: string) {
    try {
        const existingProfile = await db.select().from(profiles).limit(1);

        if (existingProfile.length > 0) {
            await db
                .update(profiles)
                .set({ vision, mission, updatedAt: new Date() })
                .where(eq(profiles.id, existingProfile[0].id));
        } else {
            await db.insert(profiles).values({
                id: 'main-profile',
                vision,
                mission,
                principalName: 'Default Principal',
                principalWelcome: 'Welcome',
                history: 'History goes here',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
        revalidatePath('/admin/profile/vision-mission');
        revalidatePath('/profile/vision-mission');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error updating vision and mission:', error);
        return {
            success: false,
            error: 'Failed to update vision and mission.',
        };
    }
}

export async function getProfile() {
    const profile = await db.select().from(profiles).limit(1);
    if (profile.length === 0) {
        return null;
    }
    return profile[0];
}
