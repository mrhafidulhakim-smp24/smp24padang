"use server";

import prisma from "@/lib/prisma";

export async function getAchievements() {
  return prisma.achievement.findMany({
    orderBy: { createdAt: "desc" },
  });
}
