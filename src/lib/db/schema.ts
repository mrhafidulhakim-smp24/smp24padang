
import {
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const banners = pgTable("banners", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const news = pgTable("news", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const announcements = pgTable("announcements", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey(),
  principalName: text("principalName").notNull(),
  principalWelcome: text("principalWelcome").notNull(),
  principalImageUrl: text("principalImageUrl"),
  history: text("history").notNull(),
  vision: text("vision").notNull(),
  mission: text("mission").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const statistics = pgTable("statistics", {
  id: varchar("id").primaryKey(),
  classrooms: integer("classrooms").notNull(),
  students: integer("students").notNull(),
  teachers: integer("teachers").notNull(),
  staff: integer("staff").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const facilities = pgTable("facilities", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("imageUrl").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const academics = pgTable("academics", {
    id: varchar("id").primaryKey(),
    curriculumTitle: text("curriculumTitle").notNull(),
    curriculumDescription: text("curriculumDescription").notNull(),
    curriculumImageUrl: text("curriculumImageUrl"),
    structureTitle: text("structureTitle").notNull(),
    structureDescription: text("structureDescription").notNull(),
    structureImageUrl: text("structureImageUrl"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const achievements = pgTable("achievements", {
    id: varchar("id").primaryKey(),
    title: text("title").notNull(),
    student: text("student").notNull(),
    description: text("description").notNull(),
    imageUrl: text("imageUrl"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const galleryItems = pgTable("galleryItems", {
    id: varchar("id").primaryKey(),
    src: text("src").notNull(),
    alt: text("alt").notNull(),
    category: text("category").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const staff = pgTable("staff", {
    id: varchar("id").primaryKey(),
    name: text("name").notNull(),
    position: text("position").notNull(),
    subject: text("subject"),
    homeroomOf: text("homeroomOf"),
    imageUrl: text("imageUrl"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});
