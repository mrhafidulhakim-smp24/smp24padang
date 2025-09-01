# Website Resmi SMPN 24 Padang

> Gerbang Digital Menuju Informasi, Prestasi, dan Inovasi Pendidikan.

## Visi Proyek

Proyek ini merupakan representasi digital dari visi dan misi **SMPN 24 Padang**, dirancang tidak hanya sebagai sumber informasi, tetapi sebagai sebuah platform ekosistem digital yang menghubungkan seluruh komunitas sekolah—siswa, guru, orang tua, dan masyarakat luas.

Dibangun dengan presisi arsitektural dan visi jangka panjang, website ini bertujuan untuk menjadi fondasi digital yang adaptif, aman, dan berkelanjutan bagi citra dan kemajuan sekolah di era modern.

## Arsitektur & Fitur Unggulan

Setiap fitur dirancang untuk memberikan nilai, fungsionalitas, dan pengalaman pengguna yang superior.

-   `📰` **Pusat Informasi Dinamis:** Publikasi berita, artikel, dan pengumuman sekolah secara *real-time* melalui sistem manajemen konten yang intuitif.

-   `🏆` **Etalase Prestasi & Akreditasi:** Sebuah panggung digital untuk menampilkan pencapaian siswa dan guru, serta menegaskan komitmen sekolah terhadap kualitas melalui data akreditasi.

-   `🖼️` **Galeri Digital Imersif:** Dokumentasi visual dari setiap kegiatan, acara, dan momen berharga di sekolah, disajikan dalam antarmuka yang modern dan menarik.

-   `⚙️` **Panel Administrasi Terintegrasi:** Sebuah *command center* terpusat bagi administrator untuk mengelola seluruh konten website dengan efisiensi, keamanan, dan kemudahan maksimal.

-   `📱` **Desain Responsif & Aksesibel:** Dirancang dengan pendekatan *mobile-first*, memastikan pengalaman yang konsisten dan optimal di semua perangkat, dari desktop hingga smartphone.

## Fondasi Teknologi

Kualitas sebuah bangunan digital ditentukan oleh fondasi teknologinya. Proyek ini dibangun di atas tumpukan teknologi modern yang dipilih untuk performa, skalabilitas, dan keandalan.

| Kategori             | Teknologi                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| **Core Framework**   | [Next.js 14](https://nextjs.org/) (App Router)                                                        |
| **Bahasa**           | [TypeScript](https://www.typescriptlang.org/)                                                         |
| **UI & Styling**     | [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)                          |
| **ORM & Database**   | [Drizzle ORM](https://orm.drizzle.team/), [Vercel Postgres](https://vercel.com/storage/postgres)        |
| **Otentikasi**       | [Auth.js (NextAuth.js)](https://authjs.dev/)                                                          |
| **Deployment**       | [Vercel](https://vercel.com/)                                                                         |

## Panduan Pengembangan

Repositori ini berisi kode sumber lengkap. Untuk memulai pengembangan di lingkungan lokal, ikuti langkah-langkah berikut.

### 1. Instalasi

Pastikan Anda memiliki **Node.js (v18+)** dan **npm**.

```bash
# 1. Kloning repositori
git clone https://github.com/username/repository.git # Ganti dengan URL repo Anda

# 2. Masuk ke direktori proyek
cd Website

# 3. Instal dependensi
npm install
```

### 2. Konfigurasi Lingkungan

Buat file `.env.local` di direktori root dan isi dengan variabel yang diperlukan, terutama `DATABASE_URL`.

```env
DATABASE_URL="your_postgres_connection_string"
AUTH_SECRET="your_strong_random_secret"
```

### 3. Migrasi Database

Jalankan migrasi untuk menyinkronkan skema database Anda.

```bash
npm run db:migrate
```

### 4. Jalankan Server Lokal

Mulai server pengembangan pada `http://localhost:3000`.

```bash
npm run dev
```

---

*Dokumen ini dirancang untuk memberikan gambaran umum yang jelas dan ringkas, baik dari perspektif bisnis maupun teknis, sesuai dengan standar profesionalisme tertinggi.*
