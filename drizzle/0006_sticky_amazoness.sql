ALTER TABLE "banners" ALTER COLUMN "title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "banners" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "uniforms" ALTER COLUMN "id" SET DATA TYPE integer;