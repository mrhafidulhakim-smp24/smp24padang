
"use server";
import prisma from '@/lib/prisma';

export async function getAchievements() {
  return await prisma.achievement.findMany({
      orderBy: { createdAt: 'desc' }
  });
}
