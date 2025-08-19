import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Building, GraduationCap, Users } from 'lucide-react';

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

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full bg-primary/10">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="School Campus"
          layout="fill"
          objectFit="cover"
          className="z-0 opacity-20"
          data-ai-hint="school campus"
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary">
          <h1 className="font-headline text-4xl font-bold drop-shadow-md md:text-6xl">
            Selamat Datang di SMPN 24 Padang
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-primary/80 drop-shadow-sm">
            Membina Pikiran, Membentuk Masa Depan. Jelajahi dunia pembelajaran dan penemuan kami.
          </p>
        </div>
      </section>

      {/* Welcome from Principal Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 md:grid-cols-2">
          <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-xl">
            <Image 
              src="https://placehold.co/600x800.png" 
              alt="Principal" 
              layout="fill" 
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
                  <GraduationCap className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="font-headline pt-4 text-primary">Akademik</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Kurikulum yang ketat dan inovatif yang dirancang untuk menantang dan menginspirasi.</p>
                <Button asChild variant="outline" className="mt-4">
                   <Link href="/academics">Pelajari Lebih Lanjut</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="transform text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <CardHeader className="items-center">
                <div className="rounded-full bg-accent/20 p-4">
                  <Users className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="font-headline pt-4 text-primary">Kehidupan Siswa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Komunitas yang dinamis dengan beragam kegiatan ekstrakurikuler dan klub.</p>
                 <Button asChild variant="outline" className="mt-4">
                   <Link href="/academics#activities">Jelajahi Kegiatan</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="transform text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <CardHeader className="items-center">
                <div className="rounded-full bg-accent/20 p-4">
                  <Building className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="font-headline pt-4 text-primary">Kampus Kami</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Fasilitas canggih yang menyediakan lingkungan belajar kelas dunia.</p>
                 <Button asChild variant="outline" className="mt-4">
                   <Link href="/profile">Kunjungi Kami</Link>
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
                <Link href="/achievements">Lihat Semua Berita</Link>
             </Button>
           </div>
        </div>
      </section>
    </div>
  );
}
