import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ArrowRight,
    BookOpen,
    ShieldCheck,
    School,
    Users,
    UserCheck,
    BookCopy,
    Target,
    Book,
    Newspaper,
    Megaphone,
} from 'lucide-react';
import { Marquee, MarqueeItem } from '@/components/ui/marquee';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import {
    getBanners,
    getLatestNews,
    getProfile,
    getStatistics,
    getFacilities,
    getAbout,
    getAnnouncements,
    getMarqueeItems,
} from './actions';
import { Separator } from '@/components/ui/separator';

export const dynamic = 'force-dynamic';

async function AboutUs() {
    const about = await getAbout();

    return (
        <section className="bg-background py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                        Visi & Misi
                    </h2>
                    <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
                        Fondasi dan komitmen yang menjadi landasan SMPN 24
                        Padang.
                    </p>
                </div>
                <div className="mt-12">
                    <Card className="h-full bg-primary/5">
                        <CardContent className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2 md:p-8">
                            <div>
                                <div className="flex items-center gap-4">
                                    <Target className="h-8 w-8 text-accent" />
                                    <h4 className="font-headline text-xl font-bold text-primary">
                                        Visi
                                    </h4>
                                </div>
                                <p className="mt-2 text-muted-foreground">
                                    {about.vision}
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center gap-4">
                                    <Book className="h-8 w-8 text-accent" />
                                    <h4 className="font-headline text-xl font-bold text-primary">
                                        Misi
                                    </h4>
                                </div>
                                <ul className="mt-2 list-disc space-y-2 pl-5 text-muted-foreground">
                                    {about.mission
                                        .slice(0, 3)
                                        .map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                </ul>
                                <Button
                                    asChild
                                    variant="link"
                                    className="mt-4 p-0 text-accent hover:text-accent/80"
                                >
                                    <Link href="/profile/vision-mission">
                                        Baca Selengkapnya{' '}
                                        <ArrowRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}

async function Announcements() {
    const announcements = await getAnnouncements();

    if (!announcements || announcements.length === 0) {
        return null; // Don't render the section if there are no announcements
    }

    return (
        <section className="bg-primary/5 py-16 md:py-24">
            <div className="container mx-auto px-4">
                <Card className="mx-auto max-w-4xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 font-headline text-3xl text-primary">
                            <Megaphone className="h-8 w-8 text-accent" />
                            Pengumuman Terbaru
                        </CardTitle>
                        <CardDescription>
                            Informasi penting dan terkini dari sekolah.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            {announcements.map((item, index) => (
                                <React.Fragment key={item.id}>
                                    <div className="flex flex-col gap-1.5">
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(
                                                item.date,
                                            ).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                        <Link
                                            href={`/articles/${item.id}`}
                                            className="font-semibold text-foreground hover:text-primary hover:underline"
                                        >
                                            {item.title}
                                        </Link>
                                        <p className="text-sm text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </div>
                                    {index < announcements.length - 1 && (
                                        <Separator />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="mt-8 text-center">
                            <Button asChild>
                                <Link href="/news">Lihat Semua Info</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

async function LatestNews() {
    const latestNews = await getLatestNews();

    if (!latestNews || latestNews.length === 0) {
        return (
            <section className="bg-primary/5 py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                        Berita Terbaru
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                        Saat ini belum ada berita terbaru. Silakan periksa
                        kembali nanti.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-primary/5 py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                        Berita Terkini
                    </h2>
                    <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
                        Ikuti kegiatan dan prestasi terbaru dari lingkungan
                        sekolah kami.
                    </p>
                </div>
                <div className="mx-auto mt-12 grid grid-cols-1 gap-8 md:max-w-4xl">
                    {latestNews.map((item) => (
                        <Card
                            key={item.id}
                            className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl sm:flex-row"
                        >
                            <div className="relative w-full sm:w-1/3">
                                <Link href={`/articles/${item.id}`}>
                                    <Image
                                        src={
                                            item.imageUrl ||
                                            'https://placehold.co/400x300.png'
                                        }
                                        alt={item.title}
                                        width={400}
                                        height={300}
                                        data-ai-hint="news event"
                                        className="h-full w-full object-cover"
                                    />
                                </Link>
                            </div>
                            <CardContent className="flex w-full flex-col p-6 sm:w-2/3">
                                <p className="mb-2 text-sm text-muted-foreground">
                                    {new Date(item.date).toLocaleDateString(
                                        'id-ID',
                                        {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        },
                                    )}
                                </p>
                                <CardTitle className="font-headline text-xl font-bold text-primary">
                                    <Link
                                        href={`/articles/${item.id}`}
                                        className="hover:underline"
                                    >
                                        {item.title}
                                    </Link>
                                </CardTitle>
                                <p className="mt-2 flex-grow text-foreground/80 dark:text-foreground/70">
                                    {item.description.substring(0, 250)}...
                                </p>
                                <Button
                                    variant="link"
                                    asChild
                                    className="mt-4 p-0 self-start text-accent hover:text-accent/80"
                                >
                                    <Link href={`/articles/${item.id}`}>
                                        Baca Lebih Lanjut{' '}
                                        <ArrowRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

async function Statistics() {
    const stats = await getStatistics();
    if (!stats) return null;
    const statistics = [
        {
            id: 'classrooms',
            value: stats.classrooms,
            label: 'Ruang Kelas',
            icon: School,
        },
        {
            id: 'students',
            value: stats.students,
            label: 'Jumlah Siswa',
            icon: Users,
        },
        {
            id: 'teachers',
            value: stats.teachers,
            label: 'Pendidik',
            icon: UserCheck,
        },
        {
            id: 'staff',
            value: stats.staff,
            label: 'Tenaga Pendidik',
            icon: BookCopy,
        },
    ];

    return (
        <section className="bg-primary/5 py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                        Statistik Data Sekolah
                    </h2>
                    <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
                        Sekilas data mengenai sumber daya di sekolah kami.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
                    {statistics.map((stat) => (
                        <Card
                            key={stat.id}
                            className="transform text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                        >
                            <CardHeader className="items-center">
                                <div className="rounded-full bg-accent/20 p-4">
                                    <stat.icon className="h-10 w-10 text-accent" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold text-primary">
                                    {stat.value}
                                </p>
                                <p className="mt-2 text-muted-foreground">
                                    {stat.label}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

async function Facilities() {
    const facilities = await getFacilities();

    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                        Fasilitas Sekolah
                    </h2>
                    <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
                        Lingkungan belajar yang lengkap dan modern untuk
                        mendukung potensi siswa.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {facilities.map((facility) => (
                        <div
                            key={facility.id}
                            className="group relative overflow-hidden rounded-lg shadow-lg"
                        >
                            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <Image
                                src={facility.imageUrl}
                                alt={facility.name}
                                width={600}
                                height={400}
                                data-ai-hint="school facility"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 z-20 flex items-end p-6">
                                <h3 className="font-headline text-xl font-bold text-white shadow-black drop-shadow-lg">
                                    {facility.name}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default async function Home() {
    const banners = await getBanners();
    const profile = await getProfile();
    const marqueeItems = await getMarqueeItems();

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative w-full">
                <Carousel opts={{ loop: true }} className="w-full">
                    <CarouselContent>
                        {banners.map((banner, index) => (
                            <CarouselItem key={index}>
                                <div className="relative h-[40vh] w-full sm:h-[60vh] lg:h-[70vh]">
                                    <div className="absolute inset-0 bg-black/50 z-10"></div>
                                    <Image
                                        src={
                                            banner.imageUrl ||
                                            'https://placehold.co/1920x1080.png'
                                        }
                                        alt={banner.title || 'Banner Image'}
                                        fill
                                        style={{ objectFit: 'contain' }}
                                        data-ai-hint="school students"
                                        className="z-0"
                                        priority={index === 0}
                                    />
                                    <div className="relative z-20 flex h-full flex-col items-center justify-center text-center text-white p-4">
                                        {banner.title && (
                                            <h1 className="font-headline text-4xl font-bold drop-shadow-md md:text-6xl">
                                                {banner.title}
                                            </h1>
                                        )}
                                        {banner.description && (
                                            <p className="mt-4 max-w-2xl text-lg text-white/90 drop-shadow-sm">
                                                {banner.description}
                                            </p>
                                        )}
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
                <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 md:grid-cols-3 lg:grid-cols-5">
                    <div className="relative mx-auto h-96 w-80 overflow-hidden rounded-lg shadow-xl md:h-[450px] md:w-full lg:col-span-2">
                        <Image
                            src={
                                profile?.principalImageUrl ||
                                'https://placehold.co/600x800.png'
                            }
                            alt="Principal"
                            fill
                            style={{
                                objectFit: 'cover',
                                objectPosition: 'top',
                            }}
                            data-ai-hint="school principal"
                            className="transition-transform duration-500 hover:scale-110"
                        />
                    </div>
                    <div className="lg:col-span-3">
                        <h2 className="font-headline text-3xl font-bold text-primary">
                            Sambutan Kepala Sekolah
                        </h2>
                        <div className="mt-4 flex items-center gap-3 rounded-lg bg-accent/80 p-3 text-accent-foreground dark:bg-accent/90">
                            <ShieldCheck className="h-6 w-6 flex-shrink-0" />
                            <p className="font-semibold">
                                Terakreditasi A - Sekolah Adiwiyata Mandiri
                                Nasional & Sekolah Ramah Anak
                            </p>
                        </div>
                        <p className="mt-4 text-lg text-muted-foreground whitespace-pre-wrap">
                            {profile?.principalWelcome.substring(0, 400)}...
                        </p>
                        <p className="mt-4 font-semibold text-primary">
                            {profile?.principalName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Kepala SMPN 24 Padang
                        </p>
                        <Button
                            asChild
                            variant="link"
                            className="mt-4 p-0 text-accent hover:text-accent/80"
                        >
                            <Link href="/profile">
                                Baca Lebih Lanjut{' '}
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <AboutUs />

            {/* Announcements Section */}
            <Announcements />

            {/* Latest News Section */}
            <LatestNews />

            {/* Statistics Section */}
            <Statistics />

            {/* Facilities Section */}
            <Facilities />
        </div>
    );
}
