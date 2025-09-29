CREATE TABLE IF NOT EXISTS "curriculums" (
    "id" serial PRIMARY KEY,
    "title" varchar(255) NOT NULL,
    "description" text NOT NULL,
    "pdf_url" text NOT NULL,
    "category" varchar(50) NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);