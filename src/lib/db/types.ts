// This file provides TypeScript type definitions for the schema
import { InferModel } from 'drizzle-orm';
import * as schema from './schema';

// Export schema table types
export type User = InferModel<typeof schema.users>;
export type Announcement = InferModel<typeof schema.announcements>;
export type News = InferModel<typeof schema.news>;
export type GalleryItem = InferModel<typeof schema.galleryItems>;
export type Statistic = InferModel<typeof schema.statistics>;
export type Staff = InferModel<typeof schema.staff>;
export type Video = InferModel<typeof schema.videos>;
export type Achievement = InferModel<typeof schema.achievements>;
export type Kelas = InferModel<typeof schema.kelas>;
export type JenisSampah = InferModel<typeof schema.jenisSampah>;
export type SampahKelas = InferModel<typeof schema.sampahKelas>;

// Re-export all schema tables
export * from './schema';
