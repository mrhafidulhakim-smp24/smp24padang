CREATE TABLE "jenis_sampah" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama_sampah" varchar(255) NOT NULL,
	"harga_per_kg" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kelas" (
	"id" serial PRIMARY KEY NOT NULL,
	"tingkat" integer NOT NULL,
	"huruf" varchar(1) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sampah_kelas" (
	"id" serial PRIMARY KEY NOT NULL,
	"kelas_id" integer NOT NULL,
	"jenis_sampah_id" integer NOT NULL,
	"jumlah_kg" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "accreditations" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"link" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "achievements" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"student" text NOT NULL,
	"description" text NOT NULL,
	"imageUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"date" text NOT NULL,
	"pdfUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "banners" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"imageUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact" (
	"id" varchar PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"googleMapsUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "facilities" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"imageUrl" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" varchar PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "galleryItems" (
	"id" varchar PRIMARY KEY NOT NULL,
	"src" text NOT NULL,
	"alt" text NOT NULL,
	"category" text NOT NULL,
	"orientation" text DEFAULT 'landscape' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"date" text NOT NULL,
	"imageUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization_structures" (
	"type" varchar(50) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"pdfUrl" text,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "past_principals" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"period" text NOT NULL,
	"imageUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" varchar PRIMARY KEY NOT NULL,
	"principalName" text NOT NULL,
	"principalWelcome" text NOT NULL,
	"principalImageUrl" text,
	"history" text NOT NULL,
	"vision" text NOT NULL,
	"mission" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"uniformPageDescription" text
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"position" text NOT NULL,
	"subject" text,
	"homeroomOf" text,
	"imageUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "statistics" (
	"id" varchar PRIMARY KEY NOT NULL,
	"classrooms" integer NOT NULL,
	"students" integer NOT NULL,
	"teachers" integer NOT NULL,
	"staff" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "uniforms" (
	"id" serial PRIMARY KEY NOT NULL,
	"day" text,
	"type" text DEFAULT 'daily' NOT NULL,
	"description" text NOT NULL,
	"image" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"password" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"youtubeUrl" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sampah_kelas" ADD CONSTRAINT "sampah_kelas_kelas_id_kelas_id_fk" FOREIGN KEY ("kelas_id") REFERENCES "public"."kelas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sampah_kelas" ADD CONSTRAINT "sampah_kelas_jenis_sampah_id_jenis_sampah_id_fk" FOREIGN KEY ("jenis_sampah_id") REFERENCES "public"."jenis_sampah"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_kelas" ON "kelas" USING btree ("tingkat","huruf");--> statement-breakpoint
CREATE UNIQUE INDEX "uniforms_type_day_idx" ON "uniforms" USING btree ("type","day");