
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Pencil, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Banner = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

type Facility = {
  id: string;
  name: string;
  imageUrl: string;
}

type MarqueeItem = {
    id: string;
    type: 'Berita' | 'Prestasi' | 'Pengumuman';
    text: string;
}

const initialBanners: Banner[] = [
  { id: '1', title: 'Selamat Datang di SMPN 24 Padang', description: 'Sekolah unggul yang berdedikasi untuk membentuk generasi masa depan yang cerdas, kreatif, dan berkarakter.', imageUrl: 'https://placehold.co/1920x1080.png' },
  { id: '2', title: 'Penerimaan Siswa Baru 2024/2025', description: 'Bergabunglah dengan komunitas kami dan mulailah perjalanan pendidikan Anda.', imageUrl: 'https://placehold.co/1920x1080.png' },
];

const initialStats = {
  classrooms: 24,
  students: 773,
  teachers: 30,
  staff: 12,
};

const initialFacilities: Facility[] = [
    { id: '1', name: 'Laboratorium Komputer', imageUrl: 'https://placehold.co/600x400.png' },
    { id: '2', name: 'Perpustakaan', imageUrl: 'https://placehold.co/600x400.png' },
    { id: '3', name: 'Lapangan Olahraga', imageUrl: 'https://placehold.co/600x400.png' },
];

const initialMarqueeItems: MarqueeItem[] = [
    { id: '1', type: 'Prestasi', text: 'Andi Pratama memenangkan Olimpiade Sains Nasional!' },
    { id: '2', type: 'Berita', text: 'Pendaftaran siswa baru tahun ajaran 2024/2025 telah dibuka.' },
    { id: '3', type: 'Pengumuman', text: 'Jadwal Ujian Akhir Semester akan diumumkan minggu depan.' },
    { id: '4', type: 'Prestasi', text: 'Tim Basket Sekolah meraih Juara 1 tingkat Provinsi.' },
    { id: '5', type: 'Berita', text: 'Sekolah kami mengadakan pameran seni pada tanggal 20 Desember.' },
];


function BannersTab() {
    const [banners, setBanners] = useState<Banner[]>(initialBanners);
    // Add logic for banner management (add, edit, delete) here
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Kelola Banner</CardTitle>
                    <CardDescription>Tambah, edit, atau hapus banner yang tampil di halaman utama.</CardDescription>
                </div>
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2 h-4 w-4" /> Tambah Banner</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah Banner Baru</DialogTitle>
                        </DialogHeader>
                        {/* Form to add a new banner */}
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Gambar</TableHead>
                            <TableHead>Judul</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {banners.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Image src={item.imageUrl} alt={item.title} width={120} height={67} className="rounded-md object-cover" />
                                </TableCell>
                                <TableCell className="font-medium">{item.title}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="icon"><Pencil className="h-4 w-4" /></Button>
                                        <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

function MarqueeTab() {
    const [marqueeItems, setMarqueeItems] = useState<MarqueeItem[]>(initialMarqueeItems);
    // Add logic for marquee item management
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Kelola Teks Berjalan</CardTitle>
                    <CardDescription>Tambah, edit, atau hapus item teks berjalan (marquee).</CardDescription>
                </div>
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2 h-4 w-4" /> Tambah Item</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah Item Teks Baru</DialogTitle>
                        </DialogHeader>
                        {/* Form to add a new marquee item */}
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tipe</TableHead>
                            <TableHead>Teks</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {marqueeItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.type}</TableCell>
                                <TableCell className="font-medium">{item.text}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="icon"><Pencil className="h-4 w-4" /></Button>
                                        <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

function StatisticsTab() {
  const [stats, setStats] = useState(initialStats);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStats(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving statistics:", stats);
    toast({
      title: "Sukses!",
      description: "Data statistik berhasil diperbarui (mode simulasi).",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
        <Card>
            <CardHeader>
                <CardTitle>Data Statistik Sekolah</CardTitle>
                <CardDescription>Perbarui data statistik yang ditampilkan di halaman beranda.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="classrooms">Jumlah Ruang Kelas</Label>
                        <Input id="classrooms" name="classrooms" type="number" value={stats.classrooms} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="students">Jumlah Siswa</Label>
                        <Input id="students" name="students" type="number" value={stats.students} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="teachers">Jumlah Pendidik</Label>
                        <Input id="teachers" name="teachers" type="number" value={stats.teachers} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="staff">Jumlah Tenaga Kependidikan</Label>
                        <Input id="staff" name="staff" type="number" value={stats.staff} onChange={handleChange} required />
                    </div>
                </div>
            </CardContent>
            <div className="flex justify-end p-6">
                <Button type="submit">Simpan Statistik</Button>
            </div>
        </Card>
    </form>
  );
}

function FacilitiesTab() {
    const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
    // Add logic for facility management here
     return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Kelola Fasilitas</CardTitle>
                    <CardDescription>Tambah, edit, atau hapus fasilitas sekolah.</CardDescription>
                </div>
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2 h-4 w-4" /> Tambah Fasilitas</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah Fasilitas Baru</DialogTitle>
                        </DialogHeader>
                        {/* Form to add a new facility */}
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Gambar</TableHead>
                            <TableHead>Nama Fasilitas</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {facilities.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Image src={item.imageUrl} alt={item.name} width={120} height={80} className="rounded-md object-cover" />
                                </TableCell>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="icon"><Pencil className="h-4 w-4" /></Button>
                                        <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default function HomepageAdminPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
          Kelola Halaman Beranda
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Kelola semua konten yang ada di halaman beranda dari satu tempat.
        </p>
      </div>

      <Tabs defaultValue="banners" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="banners">Banner</TabsTrigger>
          <TabsTrigger value="marquee">Teks Berjalan</TabsTrigger>
          <TabsTrigger value="statistics">Statistik</TabsTrigger>
          <TabsTrigger value="facilities">Fasilitas</TabsTrigger>
        </TabsList>
        <TabsContent value="banners" className="mt-4">
          <BannersTab />
        </TabsContent>
         <TabsContent value="marquee" className="mt-4">
          <MarqueeTab />
        </TabsContent>
        <TabsContent value="statistics" className="mt-4">
          <StatisticsTab />
        </TabsContent>
        <TabsContent value="facilities" className="mt-4">
            <FacilitiesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
