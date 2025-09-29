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
ALTER TABLE "sampah_kelas" ADD CONSTRAINT "sampah_kelas_kelas_id_kelas_id_fk" FOREIGN KEY ("kelas_id") REFERENCES "public"."kelas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sampah_kelas" ADD CONSTRAINT "sampah_kelas_jenis_sampah_id_jenis_sampah_id_fk" FOREIGN KEY ("jenis_sampah_id") REFERENCES "public"."jenis_sampah"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_kelas" ON "kelas" USING btree ("tingkat","huruf");