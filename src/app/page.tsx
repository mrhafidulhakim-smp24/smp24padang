// src/app/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ArrowRight,
    ShieldCheck,
    School,
    Users,
    UserCheck,
    BookCopy,
    Target,
    Book,
    Megaphone,
} from 'lucide-react';
import { Marquee } from '@/components/ui/marquee';
import { ClientCarousel } from '@/components/client-carousel';
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
import FaqAccordion from '@/components/faq/faq-accordion';
import { BlurImage } from '@/components/blur-image';
import placeholders from '@/lib/placeholders.json';
import Facilities from '@/components/Facilities';

export const metadata: Metadata = {
    title: 'SMPN 24 Padang | Cerdas, Terampil & Bebudidaya Lingkungan',
    description:
        'Website resmi SMPN 24 Padang. Jelajahi profil, berita, prestasi, galeri, dan informasi lengkap seputar sekolah kami.',
};

export const revalidate = 60;

async function AboutUs() {
    const about = await getAbout();

    return (
        <section className="bg-background py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                        Visi & Misi
                    </h2>
                    <p className="mx-auto mt-2 max-w-2xl text-foreground">
                        Fondasi dan komitmen yang menjadi landasan SMPN 24
                        Padang.
                    </p>
                </div>
                <div className="mt-12">
                    <Card className="h-full bg-primary/5">
                        <CardContent className="flex flex-col gap-8 p-6 md:p-8">
                            <div>
                                <div className="flex items-center justify-center gap-4">
                                    <Target className="h-8 w-8 text-green-600" />
                                    <h4 className="font-headline text-3xl font-bold text-primary">
                                        Visi
                                    </h4>
                                </div>
                                <p className="mt-2 text-center text-2xl font-bold text-foreground">
                                    {about.vision}
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center justify-center gap-4">
                                    <Book className="h-8 w-8 text-green-600" />
                                    <h4 className="font-headline text-3xl font-bold text-primary">
                                        Misi
                                    </h4>
                                </div>
                                <div className="mt-2 space-y-2 font-bold text-foreground">
                                    {about.mission
                                        .slice(0, 10)
                                        .map((item: string, index: number) => (
                                            <p key={index}>{item}</p>
                                        ))}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-center">
                            <Button
                                asChild
                                variant="link"
                                className="mt-4 p-0 self-start text-primary hover:text-primary/80"
                            >
                                <Link href="/profile/vision-mission">
                                    Baca Selengkapnya{' '}
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </section>
    );
}

async function Announcements() {
    const announcements = await getAnnouncements();
    if (!announcements || announcements.length === 0) return null;

    return (
        <section className="bg-primary/5 py-16 md:py-24">
            <div className="container mx-auto px-4">
                <Card className="mx-auto max-w-6xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 font-headline text-3xl text-primary">
                            <Megaphone className="h-8 w-8 text-green-600" />
                            Pengumuman Terbaru
                        </CardTitle>
                        <CardDescription>
                            Informasi penting dan terkini dari sekolah.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            {announcements.map((item: any, index: number) => (
                                <React.Fragment key={item.id}>
                                    <div className="flex flex-col gap-1.5">
                                        <p className="text-sm text-foreground">
                                            {new Date(
                                                item.date,
                                            ).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                        <Link
                                            href="/pengumuman"
                                            className="font-semibold text-foreground hover:text-primary hover:underline"
                                        >
                                            {item.title}
                                        </Link>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
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
                                <Link href="/pengumuman">
                                    Lihat Semua Pengumuman
                                </Link>
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
                    <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
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

                <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
                    {latestNews.map((item: any) => (
                        <Card
                            key={item.id}
                            className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl"
                        >
                            <div className="relative w-full aspect-video">
                                <Link
                                    href={`/articles/${item.id}`}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={
                                            item.imageUrl ??
                                            'https://placehold.co/400x400.png'
                                        }
                                        alt={item.title}
                                        fill
                                        loading="lazy"
                                        className="object-cover"
                                    />
                                </Link>
                            </div>
                            <div className="flex flex-1 flex-col justify-between p-4">
                                <div>
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
                                    <CardTitle className="font-headline text-lg font-bold text-primary">
                                        <Link
                                            href={`/articles/${item.id}`}
                                            className="hover:underline"
                                        >
                                            {item.title}
                                        </Link>
                                    </CardTitle>
                                    <p className="mt-2 text-sm text-foreground dark:text-foreground">
                                        {item.description?.substring(0, 80)}
                                        ...
                                    </p>
                                </div>
                                <Button
                                    variant="link"
                                    asChild
                                    className="mt-4 p-0 self-start text-primary hover:text-primary/80"
                                >
                                    <Link href={`/articles/${item.id}`}>
                                        Baca Lebih Lanjut{' '}
                                        <ArrowRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
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
            label: 'Guru',
            icon: UserCheck,
        },
        { id: 'staff', value: stats.staff, label: 'Staf', icon: BookCopy },
    ];

    return (
        <section className="bg-primary/5 py-12 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary">
                        Statistik Data Sekolah
                    </h2>
                    <p className="mx-auto mt-1 max-w-2xl text-foreground text-sm md:text-base">
                        Sekilas data mengenai sumber daya di sekolah kami.
                    </p>
                </div>

                {/* MOBILE: grid 2x2 (grid-cols-2) */}
                <div className="mt-6 grid grid-cols-2 gap-3 md:hidden">
                    {statistics.map((s) => (
                        <div
                            key={s.id}
                            className="rounded-lg bg-card p-3 flex items-center gap-3"
                            role="group"
                            aria-label={`${s.label} - ${s.value}`}
                        >
                            <div className="rounded-full bg-green-600/10 p-2 flex items-center justify-center">
                                <s.icon className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xl font-semibold text-primary leading-tight">
                                    {s.value}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {s.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* DESKTOP: grid 4 kolom */}
                <div className="hidden md:grid mt-8 grid-cols-2 md:grid-cols-4 gap-6">
                    {statistics.map((stat) => (
                        <Card
                            key={stat.id}
                            className="text-center shadow-none hover:shadow-lg transition-shadow duration-300"
                        >
                            <CardHeader className="items-center">
                                <div className="rounded-full bg-green-600/20 p-4">
                                    <stat.icon className="h-10 w-10 text-green-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl md:text-4xl font-bold text-primary">
                                    {stat.value}
                                </p>
                                <p className="mt-2 text-foreground">
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

async function FaqSection() {
    return (
        <section className="bg-primary/5 py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                        Pertanyaan Umum
                    </h2>
                    <p className="mx-auto mt-2 max-w-2xl text-foreground">
                        Temukan jawaban atas pertanyaan yang sering diajukan.
                    </p>
                </div>
                <div className="mt-12 max-w-3xl mx-auto">
                    <FaqAccordion />
                </div>
                <div className="mt-8 text-center">
                    <Button asChild>
                        <Link href="/contact">Selengkapnya</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default async function Home() {
    const banners = await getBanners();
    const profile = await getProfile();
    const marqueeItems = await getMarqueeItems();
    const facilities = await getFacilities();

    return (
        <div className="flex flex-col">
            <h1 className="sr-only">
                Selamat Datang di Website Resmi SMPN 24 Padang
            </h1>

            {/* Hero */}
            <section className="relative w-full">
                <ClientCarousel banners={banners} />
            </section>

            {/* Marquee */}
            <section>
                <Marquee items={marqueeItems} />
            </section>

            {/* Welcome from Principal */}
            <section className="bg-primary/5 py-16 md:py-24">
                <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 md:grid-cols-3 lg:grid-cols-5">
                    <div className="relative mx-auto h-96 w-80 overflow-hidden rounded-lg shadow-xl md:h-[450px] md:w-full md:col-span-1 lg:col-span-2">
                        <Image
                            src={
                                profile?.principalImageUrl ??
                                'https://placehold.co/600x800.png'
                            }
                            alt="Principal"
                            fill
                            loading="lazy"
                            style={{
                                objectFit: 'cover',
                                objectPosition: 'top',
                            }}
                            className="transition-transform duration-500 hover:scale-110"
                        />
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                        <h2 className="font-headline text-3xl font-bold text-primary">
                            Sambutan Kepala Sekolah
                        </h2>
                        <div className="mt-4 flex items-center gap-3 rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                            <ShieldCheck className="h-6 w-6 flex-shrink-0 text-green-600 dark:text-green-400" />
                            <p className="font-semibold text-green-800 dark:text-green-200">
                                Terakreditasi A - Sekolah Adiwiyata Mandiri
                                Nasional, Sekolah Ramah Anak & Sekolah Siaga
                                Kependudukan
                            </p>
                        </div>
                        <div
                            className="mt-4 text-lg text-foreground line-clamp-8"
                            dangerouslySetInnerHTML={{
                                __html: profile?.principalWelcome ?? '',
                            }}
                        />
                        <p className="mt-4 font-semibold text-primary">
                            {profile?.principalName}
                        </p>
                        <p className="text-sm text-foreground">
                            Kepala SMPN 24 Padang
                        </p>
                        <Button
                            asChild
                            variant="link"
                            className="mt-4 p-0 text-green-600 hover:text-green-700"
                        >
                            <Link href="/profile">
                                Baca Lebih Lanjut tentang Kepala Sekolah{' '}
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <AboutUs />
            <Announcements />
            <LatestNews />
            <Statistics />

            {/* use client-side Facilities component */}
            <Facilities
                facilities={facilities}
                placeholders={
                    placeholders as Array<{ src: string; base64: string }>
                }
            />

            <FaqSection />
        </div>
    );
}
