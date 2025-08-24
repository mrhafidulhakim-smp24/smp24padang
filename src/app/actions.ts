
"use server";

import prisma from "@/lib/prisma";

export async function getBanners() {
  return prisma.banner.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getLatestNews() {
  return prisma.newsArticle.findMany({
    orderBy: { date: "desc" },
    take: 3,
  });
}

export async function getProfile() {
    return prisma.profile.findFirst();
}
