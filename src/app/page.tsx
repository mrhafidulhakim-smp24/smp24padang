
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, ShieldCheck, School, Users, UserCheck, BookCopy, Target, Book } from 'lucide-react';
import { Marquee } from '@/components/ui/marquee';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { getBanners, getLatestNews, getProfile, getStatistics, getFacilities, getAbout } from './actions';

async function AboutUs() {
  const about = await getAbout();

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">Visi & Misi</h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Fondasi dan komitmen yang menjadi landasan SMPN 24 Padang.
          </p>
        </div>
        <div className="mt-12 flex justify-center">
          <div className="w-full max-w-4xl">
            <Card className="h-full bg-primary/5">
              <CardContent className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2 md:p-8">
                <div>
                    <div className="flex items-center gap-4">
                      <Target className="h-8 w-8 text-accent" />
                      <h4 className="font-headline text-xl font-bold text-primary">Visi</h4>
                    </div>
                    <p className="mt-2 text-muted-foreground">{about.vision}</p>
                </div>
                <div>
                    <div className="flex items-center gap-4">
                      <Book className="h-8 w-8 text-accent" />
                      <h4 className="font-headline text-xl font-bold text-primary">Misi</h4>
                    </div>
                     <ul className="mt-2 list-disc space-y-2 pl-5 text-muted-foreground">
                        {about.mission.slice(0, 3).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                      <Button asChild variant="link" className="mt-4 p-0 text-accent hover:text-accent/80">
                          <Link href="/profile/vision-mission">
                              Baca Selengkapnya <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                      </Button>
                  </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}


async function Announcement() {
  const latestNews = await getLatestNews();

  if (!latestNews || latestNews.length === 0) {
    return (
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">Pengumuman Terbaru</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Saat ini belum ada pengumuman terbaru. Silakan periksa kembali nanti.
          </p>
        </div>
      </section>
    )
  }

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

async function Statistics() {
  const stats = await getStatistics();
  const statistics = [
    { id: 'classrooms', value: stats.classrooms, label: 'Ruang Kelas', icon: School },
    { id: 'students', value: stats.students, label: 'Jumlah Siswa', icon: Users },
    { id: 'teachers', value: stats.teachers, label: 'Pendidik', icon: UserCheck },
    { id: 'staff', value: stats.staff, label: 'Tenaga Pendidik', icon: BookCopy },
  ];

  return (
     <section className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">Statistik Data Sekolah</h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              Sekilas data mengenai sumber daya di sekolah kami.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            {statistics.map((stat) => (
              <Card key={stat.id} className="transform text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <CardHeader className="items-center">
                  <div className="rounded-full bg-accent/20 p-4">
                    <stat.icon className="h-10 w-10 text-accent" />
                  </div>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold text-primary">{stat.value}</p>
                    <p className="mt-2 text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
  )
}

async function Facilities() {
    const facilities = await getFacilities();

    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">Fasilitas Sekolah</h2>
                    <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
                        Lingkungan belajar yang lengkap dan modern untuk mendukung potensi siswa.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {facilities.map((facility) => (
                        <div key={facility.id} className="group relative overflow-hidden rounded-lg shadow-lg">
                             <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <Image 
                                src={facility.imageUrl}
                                alt={facility.name}
                                width={600}
                                height={400}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 z-20 flex items-end p-6">
                                <h3 className="font-headline text-xl font-bold text-white shadow-black drop-shadow-lg">{facility.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default async function Home() {
  const banners = await getBanners();
  const profile = await getProfile();
  const latestNews = await getLatestNews();

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
      <section className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="relative h-80 w-full overflow-hidden rounded-lg shadow-xl lg:col-span-2">
            <Image 
              src={profile?.principalImageUrl || "https://placehold.co/600x800.png"} 
              alt="Principal" 
              fill 
              style={{objectFit: 'cover', objectPosition: 'top'}}
              className="transition-transform duration-500 hover:scale-110"
            />
          </div>
          <div className="lg:col-span-3">
            <h2 className="font-headline text-3xl font-bold text-primary">Sambutan Kepala Sekolah</h2>
             <div className="mt-4 flex items-center gap-3 rounded-lg bg-accent/80 p-3 text-accent-foreground dark:bg-accent/90">
               <ShieldCheck className="h-6 w-6 flex-shrink-0" />
               <p className="font-semibold">Terakreditasi A - Sekolah Adiwiyata Nasional & Ramah Anak</p>
            </div>
            <p className="mt-4 text-lg text-muted-foreground">
              {profile?.principalWelcome.substring(0,250)}...
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

      {/* About Us Section */}
      <AboutUs />
      
      {/* Announcements Section */}
      <Announcement />

      {/* Statistics Section */}
      <Statistics />

      {/* Facilities Section */}
      <Facilities />

      {/* Latest News Section */}
      <section className="bg-primary/5 py-16 md:py-24">
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

    