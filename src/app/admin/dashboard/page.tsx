'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
    Newspaper,
    Trophy,
    Image as ImageIcon,
    Users,
    Home,
    Phone,
    UserCircle,
    Target,
    Network,
    Award,
    Shirt,
    Megaphone,
} from 'lucide-react';

const menuItems = [
    {
        href: '/admin/homepage',
        label: 'Halaman Beranda',
        icon: Home,
        description: 'Atur konten yang tampil di halaman depan website Anda.',
    },
    {
        href: '/admin/profile/principal',
        label: 'Profil Sekolah',
        icon: UserCircle,
        description: 'Perbarui informasi sambutan kepala sekolah dan sejarah.',
    },
    {
        href: '/admin/profile/vision-mission',
        label: 'Visi & Misi',
        icon: Target,
        description: 'Ubah pernyataan visi dan poin-poin misi sekolah.',
    },
    {
        href: '/admin/organization',
        label: 'Struktur Organisasi',
        icon: Network,
        description: 'Kelola bagan dan daftar struktur organisasi sekolah.',
    },
    {
        href: '/admin/accreditation',
        label: 'Sertifikasi & Penghargaan',
        icon: Award,
        description: 'Tampilkan semua sertifikasi dan penghargaan.',
    },
    {
        href: '/admin/profile/uniform',
        label: 'Seragam',
        icon: Shirt,
        description: 'Informasikan jenis-jenis seragam yang digunakan.',
    },
    {
        href: '/admin/staff',
        label: 'Guru & Staf',
        icon: Users,
        description: 'Tambah, ubah, atau hapus data pengajar dan staf.',
    },
    {
        href: '/admin/news',
        label: 'Berita',
        icon: Newspaper,
        description: 'Publikasikan artikel berita terbaru untuk pengunjung.',
    },
    {
        href: '/admin/announcements',
        label: 'Pengumuman',
        icon: Megaphone,
        description: 'Buat pengumuman penting untuk seluruh warga sekolah.',
    },
    {
        href: '/admin/achievements',
        label: 'Prestasi',
        icon: Trophy,
        description: 'Catat dan pamerkan prestasi yang telah diraih.',
    },
    {
        href: '/admin/gallery',
        label: 'Galeri',
        icon: ImageIcon,
        description: 'Unggah dan kelola foto-foto kegiatan sekolah.',
    },
    {
        href: '/admin/contact',
        label: 'Kontak',
        icon: Phone,
        description: 'Perbarui alamat, email, dan nomor telepon sekolah.',
    },
];

export default function AdminDashboardPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                    Selamat Datang di Panel Admin
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Pilih salah satu menu di bawah ini untuk mulai mengelola
                    konten website Anda. Setiap kartu mewakili satu bagian dari
                    website yang bisa Anda ubah.
                </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link href={item.href} key={item.href}>
                            <Card className="flex h-full transform flex-col transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="rounded-lg bg-primary/10 p-3">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-xl font-semibold">
                                        {item.label}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-base text-muted-foreground">
                                        {item.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
