
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';
import { Marquee } from '@/components/ui/marquee';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const banners = [
  { title: "Selamat Datang di SMPN 24 Padang", description: "Membentuk Generasi Unggul, Berkarakter, dan Inovatif.", imageUrl: "https://placehold.co/1920x1080.png", hint: "school building students" },
  { title: "Penerimaan Siswa Baru 2024/2025", description: "Bergabunglah dengan komunitas pembelajar kami yang dinamis.", imageUrl: "https://placehold.co/1920x1080.png", hint: "students registration" },
];

const latestNews = [
    { id: "1", date: new Date(), title: "Juara 1 Lomba Cerdas Cermat Tingkat Kota", description: "Tim cerdas cermat SMPN 24 Padang berhasil meraih Juara 1 dalam kompetisi tingkat kota, menunjukkan keunggulan akademik yang membanggakan.", imageUrl: "https://placehold.co/600x400.png", hint: "students winning trophy" },
    { id: "2", date: new Date(), title: "Kegiatan Jumat Bersih dan Sehat", description: "Seluruh warga sekolah berpartisipasi dalam kegiatan Jumat Bersih untuk menciptakan lingkungan belajar yang nyaman dan asri.", imageUrl: "https://placehold.co/600x400.png", hint: "students cleaning school" },
    { id: "3", date: new Date(), title: "Peringatan Hari Kemerdekaan RI ke-79", description: "Upacara bendera dan berbagai lomba meriahkan peringatan HUT RI ke-79 di SMPN 24 Padang, menumbuhkan semangat nasionalisme.", imageUrl: "https://placehold.co/600x400.png", hint: "flag ceremony" },
];

const profile = {
  principalName: "Dr. Budi Santoso, M.Pd.",
  principalWelcome: "Selamat datang di situs resmi SMPN 24 Padang. Kami berkomitmen untuk menyediakan lingkungan belajar yang menginspirasi, di mana setiap siswa dapat berkembang secara akademis, sosial, dan emosional. Dengan dukungan guru-guru yang berdedikasi dan fasilitas yang memadai, kami berupaya mencetak generasi penerus yang cerdas, berkarakter, dan siap menghadapi tantangan global. Mari bersama-sama kita wujudkan masa depan yang gemilang bagi putra-putri kita.",
  principalImageUrl: "https://placehold.co/600x800.png",
};


async function Announcement() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">Pengumuman Terbaru</h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Informasi terbaru dan terpenting seputar kegiatan sekolah.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {latestNews.map((item) => (
            <Card key={item.id} className="flex flex-col">
              <CardHeader>
                <p className="text-sm font-semibold text-accent">{`PENGUMUMAN | ${new Date(item.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}`}</p>
                <CardTitle className="font-headline text-xl text-primary">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-foreground/80 dark:text-foreground/70">
                  {item.description.substring(0, 150)}...
                </p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button asChild variant="link" className="p-0 text-accent hover:text-accent/80">
                  <Link href={`/news/${item.id}`}>
                    Baca Selengkapnya <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
         <div className="mt-12 text-center">
           <Button asChild size="lg">
              <Link href="/news">Lihat Semua Pengumuman</Link>
           </Button>
         </div>
      </div>
    </section>
  );
}

export default async function Home() {

  const marqueeItems = [
      { type: 'Prestasi', text: 'Andi Pratama memenangkan Olimpiade Sains Nasional!' },
      { type: 'Berita', text: 'Pendaftaran siswa baru tahun ajaran 2024/2025 telah dibuka.' },
      { type: 'Pengumuman', text: 'Jadwal Ujian Akhir Semester akan diumumkan minggu depan.' },
      { type: 'Prestasi', text: 'Tim Basket Sekolah meraih Juara 1 tingkat Provinsi.' },
      { type: 'Berita', text: 'Sekolah kami mengadakan pameran seni pada tanggal 20 Desember.' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full">
        <Carousel
          opts={{ loop: true }}
          className="w-full"
        >
          <CarouselContent>
            {banners.map((banner, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[70vh] w-full">
                  <div className="absolute inset-0 bg-black/50 z-10"></div>
                  <Image
                    src={banner.imageUrl || "https://placehold.co/1920x1080.png"}
                    alt={banner.title}
                    fill
                    style={{objectFit: 'cover'}}
                    className="z-0"
                    data-ai-hint={banner.hint || "school event"}
                    priority={index === 0}
                  />
                  <div className="relative z-20 flex h-full flex-col items-center justify-center text-center text-white p-4">
                    <h1 className="font-headline text-4xl font-bold drop-shadow-md md:text-6xl">
                      {banner.title}
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-white/90 drop-shadow-sm">
                      {banner.description}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex" />
        </Carousel>
      </section>

      {/* Marquee Section */}
      <section>
        <Marquee items={marqueeItems} />
      </section>

      {/* Welcome from Principal Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 md:grid-cols-2">
          <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-xl">
            <Image 
              src={profile?.principalImageUrl || "https://placehold.co/600x800.png"} 
              alt="Principal" 
              fill 
              style={{objectFit: 'cover'}}
              data-ai-hint="professional portrait"
              className="transition-transform duration-500 hover:scale-110"
            />
          </div>
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Pesan dari Kepala Sekolah</h2>
             <div className="mt-4 flex items-center gap-3 rounded-lg bg-accent/80 p-3 text-accent-foreground dark:bg-accent/90">
               <ShieldCheck className="h-6 w-6 flex-shrink-0" />
               <p className="font-semibold">Terakreditasi A - Sekolah Adiwiyata Nasional & Ramah Anak</p>
            </div>
            <p className="mt-4 text-lg text-muted-foreground">
              {profile?.principalWelcome.substring(0,200)}...
            </p>
             <p className="mt-4 font-semibold text-primary">{profile?.principalName}</p>
            <Button asChild variant="link" className="mt-4 p-0 text-accent hover:text-accent/80">
              <Link href="/profile">
                Baca Lebih Lanjut <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Announcements Section */}
      <Announcement />

      {/* Pillars Section */}
      <section className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">Pilar Keunggulan Kami</h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              Membangun fondasi yang kuat untuk masa depan setiap siswa.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="transform text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <CardHeader className="items-center">
                <div className="rounded-full bg-accent/20 p-4">
                  <BookOpen className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="font-headline pt-4 text-primary">Kurikulum Merdeka & Inovatif</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Mengadaptasi kurikulum nasional dengan pembelajaran berbasis proyek dan teknologi untuk kreativitas.</p>
                <Button asChild variant="outline" className="mt-4">
                   <Link href="/academics">Jelajahi Kurikulum</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="transform text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <CardHeader className="items-center">
                <div className="rounded-full bg-accent/20 p-4">
                  <Sparkles className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="font-headline pt-4 text-primary">Pengembangan Karakter & Bakat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Membentuk karakter mulia dan menggali potensi siswa melalui beragam kegiatan ekstrakurikuler.</p>
                 <Button asChild variant="outline" className="mt-4">
                   <Link href="/profile/extracurricular">Lihat Kegiatan</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="transform text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <CardHeader className="items-center">
                <div className="rounded-full bg-accent/20 p-4">
                  <ShieldCheck className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="font-headline pt-4 text-primary">Lingkungan Belajar Mendukung</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Menyediakan fasilitas modern dan komunitas sekolah yang aman, nyaman, dan inklusif bagi semua.</p>
                 <Button asChild variant="outline" className="mt-4">
                   <Link href="/profile/vision-mission">Pahami Nilai Kami</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-headline mb-8 text-center text-3xl font-bold text-primary md:text-4xl">
            Berita Terbaru
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((item) => (
              <Card key={item.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-xl flex flex-col">
                <CardHeader className="p-0">
                  <Link href={`/news/${item.id}`}>
                    <Image
                      src={item.imageUrl || "https://placehold.co/600x400.png"}
                      alt={item.title}
                      width={600}
                      height={400}
                      className="h-56 w-full object-cover"
                      data-ai-hint={"news article"}
                    />
                  </Link>
                </CardHeader>
                <CardContent className="flex flex-grow flex-col p-6">
                  <p className="mb-2 text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <CardTitle className="font-headline text-xl font-bold text-primary">
                    <Link href={`/news/${item.id}`} className="hover:underline">{item.title}</Link>
                  </CardTitle>
                  <p className="mt-2 text-foreground/80 dark:text-foreground/70 flex-grow">{item.description.substring(0, 100)}...</p>
                   <Button variant="link" asChild className="mt-4 p-0 self-start text-accent hover:text-accent/80">
                    <Link href={`/news/${item.id}`}>
                      Baca Lebih Lanjut <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="mt-12 text-center">
             <Button asChild size="lg">
                <Link href="/news">Lihat Semua Berita</Link>
             </Button>
           </div>
        </div>
      </section>
    </div>
  );
}
