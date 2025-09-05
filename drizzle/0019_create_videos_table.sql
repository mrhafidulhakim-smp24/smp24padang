CREATE TABLE IF NOT EXISTS "videos" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" text NOT NULL,
    "description" text,
    "youtube_url" text NOT NULL,
    "createdAt" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "news" ADD COLUMN "video_id" integer;
DO $$ BEGIN
 ALTER TABLE "news" ADD CONSTRAINT "news_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
