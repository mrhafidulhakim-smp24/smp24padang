
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';
import { Marquee } from '@/components/ui/marquee';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const heroBanners = [
  {
    title: "Selamat Datang di SMPN 24 Padang",
    description: "Membina Pikiran, Membentuk Masa Depan. Jelajahi dunia pembelajaran dan penemuan kami.",
    image: "https://placehold.co/1920x1080.png",
    hint: "school campus"
  },
  {
    title: "Penerimaan Siswa Baru 2024/2025",
    description: "Jadilah bagian dari komunitas kami yang berprestasi. Pendaftaran telah dibuka!",
    image: "https://placehold.co/1920x1080.png",
    hint: "students registration"
  },
  {
    title: "Juara Umum Lomba Cerdas Cermat",
    description: "Siswa kami kembali mengharumkan nama sekolah di tingkat nasional.",
    image: "https://placehold.co/1920x1080.png",
    hint: "students winning trophy"
  },
];

const newsItems = [
  {
    title: "Annual Sports Day Gala",
    description: "A day of thrilling competitions and spectacular performances.",
    image: "https://placehold.co/600x400.png",
    hint: "sports students",
    date: "2024-03-15",
    link: "#"
  },
  {
    title: "Science Fair Innovations",
    description: "Our students showcase their groundbreaking science projects.",
    image: "https://placehold.co/600x400.png",
    hint: "science fair",
    date: "2024-03-10",
    link: "#"
  },
  {
    title: "Art Exhibition 'Creative Canvases'",
    description: "Explore the vibrant world of art created by our talented students.",
    image: "https://placehold.co/600x400.png",
    hint: "art exhibition",
    date: "2024-03-05",
    link: "#"
  },
];

const marqueeItems = [
    { type: 'Prestasi', text: 'Andi Pratama memenangkan Olimpiade Sains Nasional!' },
    { type: 'Berita', text: 'Pendaftaran siswa baru tahun ajaran 2024/2025 telah dibuka.' },
    { type: 'Pengumuman', text: 'Jadwal Ujian Akhir Semester akan diumumkan minggu depan.' },
    { type: 'Prestasi', text: 'Tim Basket Sekolah meraih Juara 1 tingkat Provinsi.' },
    { type: 'Berita', text: 'Sekolah kami mengadakan pameran seni pada tanggal 20 Desember.' },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full">
        <Carousel
          opts={{ loop: true }}
          className="w-full"
        >
          <CarouselContent>
            {heroBanners.map((banner, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[70vh] w-full">
                  <div className="absolute inset-0 bg-black/50 z-10"></div>
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    objectFit="cover"
                    className="z-0"
                    data-ai-hint={banner.hint}
                    priority={index === 0}
                  />
                  <div className="relative z-20 flex h-full flex-col items-center justify-center text-center text-white">
                    <h1 className="font-headline text-4xl font-bold drop-shadow-md md:text-6xl animate-fade-in-down">
                      {banner.title}
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-white/90 drop-shadow-sm animate-fade-in-up">
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
              src="https://placehold.co/600x800.png" 
              alt="Principal" 
              fill 
              objectFit="cover" 
              data-ai-hint="professional portrait"
              className="transition-transform duration-500 hover:scale-110"
            />
          </div>
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Pesan dari Kepala Sekolah</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Selamat datang di SMPN 24 Padang! Kami adalah komunitas yang didedikasikan untuk membina keunggulan akademik, pengembangan karakter, dan cinta belajar seumur hidup. Komitmen kami adalah menyediakan lingkungan yang aman, membina, dan merangsang di mana setiap siswa dapat berkembang.
            </p>
            <Button asChild variant="link" className="mt-4 p-0 text-accent-foreground">
              <Link href="/profile">
                Baca Lebih Lanjut <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

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
                   <Link href="/academics#activities">Lihat Kegiatan</Link>
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
            Berita & Pengumuman Terbaru
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((item, index) => (
              <Card key={index} className="overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                <CardHeader className="p-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="h-56 w-full object-cover"
                    data-ai-hint={item.hint}
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <p className="mb-2 text-sm text-muted-foreground">{item.date}</p>
                  <CardTitle className="font-headline text-xl font-bold text-primary">
                    {item.title}
                  </CardTitle>
                  <p className="mt-2 text-foreground/80">{item.description}</p>
                  <Button variant="link" asChild className="mt-4 p-0 text-accent-foreground">
                    <Link href={item.link}>
                      Baca Lebih Lanjut <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="mt-12 text-center">
             <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/news">Lihat Semua Berita</Link>
             </Button>
           </div>
        </div>
      </section>
    </div>
  );
}
