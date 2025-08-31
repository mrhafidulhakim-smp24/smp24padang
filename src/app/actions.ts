'use server';

import { db } from '@/lib/db';
import { banners, news, announcements, profiles, statistics, facilities, marquee, pastPrincipals, achievements } from '@/lib/db/schema';
import { asc, desc, sql } from 'drizzle-orm';
import { unstable_cache as cache } from 'next/cache';

export async function getBanners() {
  return await db.select().from(banners).orderBy(asc(banners.createdAt));
}

export const getLatestNews = cache(
  async () => {
    try {
      return await db.select().from(news).orderBy(desc(news.date)).limit(4);
    } catch (error) {
      console.error("Error fetching latest news:", error);
      return [];
    }
  },
  ['latest-news'],
  { tags: ['news-collection'] }
);

export const getAnnouncements = cache(
  async () => {
    try {
      const allAnnouncements = await db.select().from(announcements);
      allAnnouncements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return allAnnouncements.slice(0, 3);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      return [];
    }
  },
  ['homepage-announcements'],
  { tags: ['announcements-collection'] }
);

export async function getProfile() {
  try {
    const profileData = await db.select().from(profiles).limit(1);
    return profileData[0] || null;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

export async function getStatistics() {
  try {
    const statsData = await db.select().from(statistics).limit(1);
    return statsData[0] || null;
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return null;
  }
}

export async function getFacilities() {
  try {
    return await db.select().from(facilities).orderBy(asc(facilities.createdAt));
  } catch (error) {
    console.error("Error fetching facilities:", error);
    return [];
  }
}

export async function getAbout() {
  try {
    const profileData = await db.select().from(profiles).limit(1);
    const profile = profileData[0] || {};
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

export async function getMarqueeItems() {
  try {
    const items = [];

    // 1. Get latest news
    const latestNews = await db.select({ title: news.title }).from(news).orderBy(desc(news.date)).limit(1);
    if (latestNews.length > 0) {
      items.push({ type: 'Berita', text: latestNews[0].title });
    }

    // 2. Get latest announcement
    const latestAnnouncement = await db.select({ title: announcements.title }).from(announcements).orderBy(desc(announcements.date)).limit(1);
    if (latestAnnouncement.length > 0) {
      items.push({ type: 'Pengumuman', text: latestAnnouncement[0].title });
    }

    // 3. Get latest achievement
    const latestAchievement = await db.select({ title: achievements.title }).from(achievements).orderBy(desc(achievements.createdAt)).limit(1);
    if (latestAchievement.length > 0) {
      items.push({ type: 'Prestasi', text: latestAchievement[0].title });
    }

    return items;
  } catch (error) {
    console.error("Error fetching dynamic marquee items:", error);
    return [];
  }
}

export async function getPastPrincipals() {
  try {
    return await db.select().from(pastPrincipals).orderBy(desc(pastPrincipals.createdAt));
  } catch (error) {
    console.error("Error fetching past principals:", error);
    return [];
  }
}
