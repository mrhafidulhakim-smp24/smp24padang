'use client';

import Link from 'next/link';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const dashboardItems = [
    {
        title: 'Kelola Halaman Beranda',
        description:
            'Ubah banner, teks berjalan, statistik, dan fasilitas yang tampil di halaman utama website.',
        link: '/admin/homepage',
    },
    {
        title: 'Kelola Profil Sekolah',
        description:
            'Perbarui informasi kepala sekolah, sejarah, visi & misi, dan detail profil lainnya.',
        link: '/admin/profile/principal',
    },
    {
        title: 'Kelola Guru & Staf',
        description:
            'Tambah, ubah, atau hapus data guru dan staf yang mengajar di sekolah.',
        link: '/admin/staff',
    },
    {
        title: 'Kelola Berita',
        description:
            'Publikasikan berita dan pengumuman terbaru untuk ditampilkan di halaman berita.',
        link: '/admin/news',
    },
    {
        title: 'Kelola Prestasi',
        description:
            'Catat dan tampilkan prestasi yang telah diraih oleh siswa atau sekolah.',
        link: '/admin/achievements',
    },
    {
        title: 'Kelola Galeri',
        description:
            'Unggah dan atur foto-foto kegiatan sekolah untuk ditampilkan di galeri.',
        link: '/admin/gallery',
    },
    {
        title: 'Kelola Kontak',
        description:
            'Perbarui informasi kontak sekolah seperti alamat, nomor telepon, dan email.',
        link: '/admin/contact',
    },
];

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Selamat datang di CMS. Pilih salah satu menu di bawah untuk
                    mengelola konten website.
                </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {dashboardItems.map((item) => (
                    <Card key={item.title} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl">
                                {item.title}
                            </CardTitle>
                            <CardDescription>
                                {item.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex items-end">
                            <Link href={item.link} className="w-full">
                                <Button className="w-full justify-between">
                                    Kelola Sekarang{' '}
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
