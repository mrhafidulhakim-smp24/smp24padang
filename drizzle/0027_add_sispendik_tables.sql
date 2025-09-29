CREATE TABLE IF NOT EXISTS "kelas" (
    "id" serial PRIMARY KEY,
    "tingkat" integer NOT NULL CHECK (tingkat IN (7, 8, 9)),
    "huruf" varchar(1) NOT NULL CHECK (huruf IN ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H')),
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "unique_kelas" UNIQUE ("tingkat", "huruf")
);

CREATE TABLE IF NOT EXISTS "jenis_sampah" (
    "id" serial PRIMARY KEY,
    "nama_sampah" varchar(255) NOT NULL,
    "harga_per_kg" decimal(10, 2) NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "sampah_kelas" (
    "id" serial PRIMARY KEY,
    "kelas_id" integer NOT NULL REFERENCES "kelas"("id") ON DELETE CASCADE,
    "jenis_sampah_id" integer NOT NULL REFERENCES "jenis_sampah"("id") ON DELETE CASCADE,
    "jumlah_kg" decimal(10, 2) NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);