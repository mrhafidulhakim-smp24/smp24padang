"use server";

import { db } from '@/lib/db';
import { banners, news, announcements, profiles, statistics, facilities, marquee, pastPrincipals } from '@/lib/db/schema';
import { asc, desc, sql } from 'drizzle-orm';

export async function getBanners() {
  return await db.select().from(banners).orderBy(asc(banners.createdAt));
}

export async function getLatestNews() {
  try {
    return await db.select().from(news).orderBy(desc(news.date)).limit(4);
  } catch (error) {
    console.error("Error fetching latest news:", error);
    return [];
  }
}

export async function getAnnouncements() {
  try {
    return await db.select().from(announcements).orderBy(desc(announcements.date)).limit(3);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }
}

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
    return await db.select().from(marquee).orderBy(desc(marquee.createdAt));
  } catch (error) {
    console.error("Error fetching marquee items:", error);
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