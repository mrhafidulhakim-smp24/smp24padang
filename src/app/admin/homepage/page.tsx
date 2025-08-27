"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose 
} from "@/components/ui/dialog";
import { 
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
    getHomepageData, 
    createBanner, updateBanner, deleteBanner,
    createMarqueeItem, updateMarqueeItem, deleteMarqueeItem,
    updateStatistics,
    createFacility, updateFacility, deleteFacility
} from "./actions";

// Type definitions from schema
type Banner = Awaited<ReturnType<typeof getHomepageData>>['banners'][0];
type MarqueeItem = Awaited<ReturnType<typeof getHomepageData>>['marquee'][0];
type Statistics = NonNullable<Awaited<ReturnType<typeof getHomepageData>>['statistics']>;
type Facility = Awaited<ReturnType<typeof getHomepageData>>['facilities'][0];

// --- Banners Tab --- //
function BannersTab({ data, refreshData }: { data: Banner[], refreshData: () => void }) {
    const { toast } = useToast();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const bannerData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            imageUrl: formData.get('imageUrl') as string,
        };

        const result = editingBanner 
            ? await updateBanner(editingBanner.id, bannerData)
            : await createBanner(bannerData);

        if (result.success) {
            toast({ title: `Banner ${editingBanner ? 'diperbarui' : 'dibuat'}!`, description: "Halaman beranda telah diperbarui." });
            refreshData();
            setDialogOpen(false);
        } else {
            toast({ title: "Gagal!", description: result.error, variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        const result = await deleteBanner(id);
        if (result.success) {
            toast({ title: "Banner dihapus!", description: "Data banner telah dihapus." });
            refreshData();
        } else {
            toast({ title: "Gagal!", description: result.error, variant: "destructive" });
        }
    };

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle>Kelola Banner</CardTitle>
                    <CardDescription>Tambah, edit, atau hapus banner di halaman utama.</CardDescription>
                </div>
                <Button onClick={() => { setEditingBanner(null); setDialogOpen(true); }}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Banner</Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader><TableRow><TableHead>Gambar</TableHead><TableHead>Judul</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell><Image src={item.imageUrl || ''} alt={item.title} width={120} height={67} className="rounded-md bg-muted object-cover" /></TableCell>
                                <TableCell className="font-medium">{item.title}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="icon" onClick={() => { setEditingBanner(item); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild><Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Anda yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini tidak bisa dibatalkan. Ini akan menghapus banner secara permanen.</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(item.id)}>Hapus</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editingBanner ? 'Edit' : 'Tambah'} Banner</DialogTitle></DialogHeader>
                    <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Judul</Label>
                            <Input id="title" name="title" defaultValue={editingBanner?.title} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea id="description" name="description" defaultValue={editingBanner?.description} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">URL Gambar</Label>
                            <Input id="imageUrl" name="imageUrl" defaultValue={editingBanner?.imageUrl || ''} placeholder="https://..." required />
                            {/* TODO: Ganti input ini dengan komponen upload Vercel Blob untuk pengalaman pengguna yang lebih baik */}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="secondary">Batal</Button></DialogClose>
                            <Button type="submit">Simpan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

// --- Marquee Tab --- //
function MarqueeTab({ data, refreshData }: { data: MarqueeItem[], refreshData: () => void }) {
    const { toast } = useToast();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MarqueeItem | null>(null);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const itemData = {
            type: formData.get('type') as MarqueeItem['type'],
            text: formData.get('text') as string,
        };

        const result = editingItem
            ? await updateMarqueeItem(editingItem.id, itemData)
            : await createMarqueeItem(itemData);

        if (result.success) {
            toast({ title: `Item ${editingItem ? 'diperbarui' : 'dibuat'}!`, description: "Teks berjalan telah diperbarui." });
            refreshData();
            setDialogOpen(false);
        } else {
            toast({ title: "Gagal!", description: result.error, variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        const result = await deleteMarqueeItem(id);
        if (result.success) {
            toast({ title: "Item dihapus!" });
            refreshData();
        } else {
            toast({ title: "Gagal!", description: result.error, variant: "destructive" });
        }
    };

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle>Kelola Teks Berjalan</CardTitle>
                    <CardDescription>Tambah, edit, atau hapus item teks berjalan.</CardDescription>
                </div>
                <Button onClick={() => { setEditingItem(null); setDialogOpen(true); }}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Item</Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader><TableRow><TableHead>Tipe</TableHead><TableHead>Teks</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.type}</TableCell>
                                <TableCell className="font-medium">{item.text}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="icon" onClick={() => { setEditingItem(item); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild><Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Anda yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini akan menghapus item teks berjalan secara permanen.</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(item.id)}>Hapus</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editingItem ? 'Edit' : 'Tambah'} Item Teks Berjalan</DialogTitle></DialogHeader>
                    <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Tipe</Label>
                            <Select name="type" defaultValue={editingItem?.type} required>
                                <SelectTrigger><SelectValue placeholder="Pilih tipe..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Berita">Berita</SelectItem>
                                    <SelectItem value="Prestasi">Prestasi</SelectItem>
                                    <SelectItem value="Pengumuman">Pengumuman</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="text">Teks</Label>
                            <Textarea id="text" name="text" defaultValue={editingItem?.text} required />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="secondary">Batal</Button></DialogClose>
                            <Button type="submit">Simpan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

// --- Statistics Tab --- //
function StatisticsTab({ data, refreshData }: { data: Statistics | null, refreshData: () => void }) {
    const [stats, setStats] = useState(data || { classrooms: 0, students: 0, teachers: 0, staff: 0 });
    const { toast } = useToast();

    useEffect(() => {
        setStats(data || { classrooms: 0, students: 0, teachers: 0, staff: 0 });
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setStats(prev => ({ ...prev, [name]: Number(value) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await updateStatistics(stats);
        if (result.success) {
            toast({ title: "Statistik diperbarui!", description: "Data statistik di halaman beranda telah diperbarui." });
            refreshData();
        } else {
            toast({ title: "Gagal!", description: result.error, variant: "destructive" });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Data Statistik Sekolah</CardTitle>
                    <CardDescription>Perbarui data statistik yang ditampilkan di halaman beranda.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button type="submit">Simpan Statistik</Button>
                </CardFooter>
            </Card>
        </form>
    );
}

// --- Facilities Tab --- //
function FacilitiesTab({ data, refreshData }: { data: Facility[], refreshData: () => void }) {
    const { toast } = useToast();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editingFacility, setEditingFacility] = useState<Facility | null>(null);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const facilityData = {
            name: formData.get('name') as string,
            imageUrl: formData.get('imageUrl') as string,
        };

        const result = editingFacility
            ? await updateFacility(editingFacility.id, facilityData)
            : await createFacility(facilityData);

        if (result.success) {
            toast({ title: `Fasilitas ${editingFacility ? 'diperbarui' : 'dibuat'}!`, description: "Data fasilitas telah diperbarui." });
            refreshData();
            setDialogOpen(false);
        } else {
            toast({ title: "Gagal!", description: result.error, variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        const result = await deleteFacility(id);
        if (result.success) {
            toast({ title: "Fasilitas dihapus!" });
            refreshData();
        } else {
            toast({ title: "Gagal!", description: result.error, variant: "destructive" });
        }
    };

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle>Kelola Fasilitas</CardTitle>
                    <CardDescription>Tambah, edit, atau hapus fasilitas sekolah.</CardDescription>
                </div>
                <Button onClick={() => { setEditingFacility(null); setDialogOpen(true); }}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Fasilitas</Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader><TableRow><TableHead>Gambar</TableHead><TableHead>Nama Fasilitas</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell><Image src={item.imageUrl} alt={item.name} width={120} height={80} className="rounded-md bg-muted object-cover" /></TableCell>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="icon" onClick={() => { setEditingFacility(item); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild><Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Anda yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini akan menghapus fasilitas secara permanen.</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(item.id)}>Hapus</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editingFacility ? 'Edit' : 'Tambah'} Fasilitas</DialogTitle></DialogHeader>
                    <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Fasilitas</Label>
                            <Input id="name" name="name" defaultValue={editingFacility?.name} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">URL Gambar</Label>
                            <Input id="imageUrl" name="imageUrl" defaultValue={editingFacility?.imageUrl} placeholder="https://..." required />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="secondary">Batal</Button></DialogClose>
                            <Button type="submit">Simpan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

// --- Main Page Component --- //
export default function HomepageAdminPage() {
    const [loading, setLoading] = useState(true);
    const [homepageData, setHomepageData] = useState<Awaited<ReturnType<typeof getHomepageData>> | null>(null);

    const fetchData = async () => {
        const data = await getHomepageData();
        setHomepageData(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading || !homepageData) {
        return (
            <div className="flex flex-col gap-8">
                <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">Kelola Halaman Beranda</h1>
                <p className="mt-2 text-lg text-muted-foreground">Memuat data manajemen beranda...</p>
                {/* TODO: Add skeleton loaders for a better UX */}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">Kelola Halaman Beranda</h1>
                <p className="mt-2 text-lg text-muted-foreground">Kelola semua konten yang ada di halaman beranda dari satu tempat.</p>
            </div>
            <Tabs defaultValue="banners" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="banners">Banner</TabsTrigger>
                    <TabsTrigger value="marquee">Teks Berjalan</TabsTrigger>
                    <TabsTrigger value="statistics">Statistik</TabsTrigger>
                    <TabsTrigger value="facilities">Fasilitas</TabsTrigger>
                </TabsList>
                <TabsContent value="banners" className="mt-4"><BannersTab data={homepageData.banners} refreshData={fetchData} /></TabsContent>
                <TabsContent value="marquee" className="mt-4"><MarqueeTab data={homepageData.marquee} refreshData={fetchData} /></TabsContent>
                <TabsContent value="statistics" className="mt-4"><StatisticsTab data={homepageData.statistics} refreshData={fetchData} /></TabsContent>
                <TabsContent value="facilities" className="mt-4"><FacilitiesTab data={homepageData.facilities} refreshData={fetchData} /></TabsContent>
            </Tabs>
        </div>
    );
}