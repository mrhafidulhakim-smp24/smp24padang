ALTER TABLE "organization_structures" RENAME COLUMN "imageUrl" TO "pdfUrl";
ALTER TABLE "galleryItems" ADD COLUMN "orientation" text DEFAULT 'landscape' NOT NULL;