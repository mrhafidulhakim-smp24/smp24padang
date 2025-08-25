
"use server";

import prisma from '@/lib/prisma';

export async function getBanners() {
  return await prisma.banner.findMany({
    orderBy: { createdAt: 'asc' }
  });
}

export async function getLatestNews() {
  return await prisma.news.findMany({
    take: 3,
    orderBy: { date: 'desc' }
  });
}

export async function getAnnouncements() {
    return await prisma.announcement.findMany({
        take: 3,
        orderBy: { date: 'desc' }
    });
}

export async function getProfile() {
    return await prisma.profile.findFirst();
}

export async function getStatistics() {
    return await prisma.statistics.findFirst();
}

export async function getFacilities() {
    return await prisma.facility.findMany({
        orderBy: { createdAt: 'asc' }
    });
}

export async function getAbout() {
    const profile = await prisma.profile.findFirst();
    return {
        history: profile?.history || '',
        vision: profile?.vision || '',
        mission: profile?.mission ? profile.mission.split('\n') : [],
    };
}
