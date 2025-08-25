
"use server";

import prisma from '@/lib/prisma';

export async function getBanners() {
  try {
    return await prisma.banner.findMany({
      orderBy: { createdAt: 'asc' }
    });
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
}

export async function getLatestNews() {
  try {
    return await prisma.news.findMany({
      take: 3,
      orderBy: { date: 'desc' }
    });
  } catch (error) {
    console.error("Error fetching latest news:", error);
    return [];
  }
}

export async function getAnnouncements() {
  try {
    return await prisma.announcement.findMany({
        take: 3,
        orderBy: { date: 'desc' }
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }
}

export async function getProfile() {
  try {
    return await prisma.profile.findFirst();
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

export async function getStatistics() {
  try {
    return await prisma.statistics.findFirst();
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return null;
  }
}

export async function getFacilities() {
  try {
    return await prisma.facility.findMany({
        orderBy: { createdAt: 'asc' }
    });
  } catch (error) {
    console.error("Error fetching facilities:", error);
    return [];
  }
}

export async function getAbout() {
  try {
    const profile = await prisma.profile.findFirst();
    return {
        history: profile?.history || '',
        vision: profile?.vision || '',
        mission: profile?.mission ? profile.mission.split('\n') : [],
    };
  } catch (error) {
    console.error("Error fetching about data:", error);
    return {
        history: '',
        vision: '',
        mission: [],
    };
  }
}
