ALTER TABLE "account" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "accreditations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "achievements" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "announcements" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "banners" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "contact" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "facilities" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "faqs" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "galleryItems" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "jenis_sampah" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "kelas" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "news" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "organization_structures" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "past_principals" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "sampah_kelas" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "session" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "staff" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "statistics" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "uniforms" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "verificationToken" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "videos" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "account" CASCADE;--> statement-breakpoint
DROP TABLE "accreditations" CASCADE;--> statement-breakpoint
DROP TABLE "achievements" CASCADE;--> statement-breakpoint
DROP TABLE "announcements" CASCADE;--> statement-breakpoint
DROP TABLE "banners" CASCADE;--> statement-breakpoint
DROP TABLE "contact" CASCADE;--> statement-breakpoint
DROP TABLE "facilities" CASCADE;--> statement-breakpoint
DROP TABLE "faqs" CASCADE;--> statement-breakpoint
DROP TABLE "galleryItems" CASCADE;--> statement-breakpoint
DROP TABLE "jenis_sampah" CASCADE;--> statement-breakpoint
DROP TABLE "kelas" CASCADE;--> statement-breakpoint
DROP TABLE "news" CASCADE;--> statement-breakpoint
DROP TABLE "organization_structures" CASCADE;--> statement-breakpoint
DROP TABLE "past_principals" CASCADE;--> statement-breakpoint
DROP TABLE "profiles" CASCADE;--> statement-breakpoint
DROP TABLE "sampah_kelas" CASCADE;--> statement-breakpoint
DROP TABLE "session" CASCADE;--> statement-breakpoint
DROP TABLE "staff" CASCADE;--> statement-breakpoint
DROP TABLE "statistics" CASCADE;--> statement-breakpoint
DROP TABLE "uniforms" CASCADE;--> statement-breakpoint
DROP TABLE "user" CASCADE;--> statement-breakpoint
DROP TABLE "verificationToken" CASCADE;--> statement-breakpoint
DROP TABLE "videos" CASCADE;--> statement-breakpoint
ALTER TABLE "curriculums" ALTER COLUMN "title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "curriculums" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "curriculums" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "curriculums" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "curriculums" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "curriculums" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "curriculums" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "curriculums" ALTER COLUMN "updated_at" DROP NOT NULL;