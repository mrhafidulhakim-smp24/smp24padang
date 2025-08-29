ALTER TABLE "uniforms" ALTER COLUMN "day" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "uniforms" ADD COLUMN "type" text DEFAULT 'daily' NOT NULL;