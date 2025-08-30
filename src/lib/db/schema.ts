import {
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
  boolean,
  serial,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const banners = pgTable("banners", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const extracurriculars = pgTable("extracurriculars", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  image: text("image"),
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

export const marquee = pgTable("marquee", {
  id: varchar("id").primaryKey(),
  type: text("type", { enum: ["Berita", "Prestasi", "Pengumuman"] }).notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const contact = pgTable("contact", {
  id: varchar("id").primaryKey(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  googleMapsUrl: text("googleMapsUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const accreditations = pgTable("accreditations", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  link: text("link").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const uniforms = pgTable("uniforms", {
  id: serial("id").primaryKey(),
  day: text("day"), // Make day optional as sport uniforms might not have a specific day
  type: text("type", { enum: ["daily", "sport"] }).notNull().default("daily"),
  description: text("description").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => {
  return {
    unq: uniqueIndex("uniforms_type_day_idx").on(table.type, table.day),
  };
});

export const organizationStructures = pgTable("organization_structures", {
  type: varchar("type", { length: 50 }).primaryKey(), // pimpinan, osis, tu
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const pastPrincipals = pgTable("past_principals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  period: text("period").notNull(),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
