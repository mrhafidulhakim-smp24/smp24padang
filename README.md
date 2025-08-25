# Situs Web Sekolah Next.js

Ini adalah situs web sekolah komprehensif yang dibangun dengan Next.js, dirancang untuk menyediakan informasi tentang akademik, prestasi, berita, dan lainnya. Situs ini dilengkapi dengan panel administrasi untuk manajemen konten dan tampilan dinamis informasi terkait sekolah.

## Fitur

*   **Halaman Konten Dinamis:** Bagian Akademik, Prestasi, Berita, Galeri, Kontak, dan Profil.
*   **Tampilan Artikel:** Halaman khusus untuk setiap artikel berita.
*   **Panel Admin:** (Diasumsikan) Antarmuka untuk mengelola konten situs web.
*   **Desain Responsif:** Dioptimalkan untuk berbagai ukuran layar.
*   **Integrasi Basis Data:** Menyimpan dan mengambil konten dinamis.

## Teknologi yang Digunakan

*   **Kerangka Kerja:** Next.js (Kerangka Kerja React)
*   **Bahasa:** TypeScript
*   **Styling:** Tailwind CSS
*   **Basis Data:** PostgreSQL (melalui Neon DB, seperti yang disimpulkan dari kesalahan sebelumnya)
*   **ORM:** Drizzle ORM
*   **Manajer Paket:** npm

## Prasyarat

Sebelum memulai, pastikan Anda telah menginstal yang berikut di sistem Anda:

*   Node.js (versi LTS direkomendasikan)
*   npm (datang bersama Node.js)
*   Server basis data PostgreSQL (berjalan secara lokal atau dapat diakses dari jarak jauh)

## Memulai

Ikuti langkah-langkah ini untuk menjalankan proyek di mesin lokal Anda.

### 1. Kloning Repositori

```bash
git clone <repository_url> # Ganti dengan URL repositori Anda yang sebenarnya
cd Website # Navigasi ke direktori proyek
```

### 2. Instal Dependensi

```bash
npm install
```

### 3. Variabel Lingkungan

Buat file `.env.local` di root proyek berdasarkan `.env.local.example` (atau yang serupa) yang disediakan. File ini akan berisi string koneksi basis data Anda dan informasi sensitif lainnya.

```
# Contoh .env.local
DATABASE_URL="postgresql://user:password@host:port/database"
SHADOW_DATABASE_URL="postgresql://user:password@host:port/database" # Seringkali sama dengan DATABASE_URL untuk pengembangan lokal
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token" # Jika menggunakan Vercel Blob Storage
```

**Penting:** Ganti nilai placeholder dengan kredensial basis data Anda yang sebenarnya dan token lain yang diperlukan. Pastikan basis data PostgreSQL Anda berjalan dan dapat diakses.

### 4. Pengaturan Basis Data

Proyek ini menggunakan Drizzle ORM untuk interaksi basis data. Anda perlu menjalankan migrasi untuk menyiapkan skema basis data Anda.

```bash
npm run db:migrate # Diasumsikan skrip ini ada di package.json
```

### 5. Menjalankan Server Pengembangan

```bash
npm run dev
```

Ini akan memulai server pengembangan di `http://localhost:3000` (atau port lain jika dikonfigurasi).

### 6. Membangun untuk Produksi

Untuk membuat build produksi aplikasi yang dioptimalkan:

```bash
npm run build
```

Perintah ini akan mengkompilasi aplikasi dan menghasilkan aset statis di direktori `.next`.

## Struktur Proyek

```
.
├── public/             # Aset statis (gambar, font)
├── src/                # Kode sumber
│   ├── app/            # Halaman dan layout Next.js App Router
│   │   ├── (routes)/   # Rute yang dikelompokkan (misalnya, akademik, prestasi, berita)
│   │   ├── admin/      # Rute panel admin
│   │   └── layout.tsx  # Layout root
│   ├── components/     # Komponen UI yang dapat digunakan kembali (berbasis shadcn/ui)
│   ├── hooks/          # Hooks React kustom
│   └── lib/            # Fungsi utilitas, koneksi basis data, skema
│       ├── db/         # Pengaturan dan skema Drizzle ORM
│       └── utils.ts    # Fungsi utilitas umum
├── drizzle/            # Migrasi Drizzle dan snapshot skema
├── next.config.js      # Konfigurasi Next.js
├── package.json        # Dependensi proyek dan skrip
├── tailwind.config.ts  # Konfigurasi Tailwind CSS
├── tsconfig.json       # Konfigurasi TypeScript
└── ...                 # File konfigurasi lainnya
```