'use client';

import React, { useEffect, useState, useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Trash2, Pencil } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
    getHomepageData,
    createBanner,
    updateBanner,
    deleteBanner,
    updateStatistics,
    createFacility,
    updateFacility,
    deleteFacility,
} from './actions';

type Banner = Awaited<ReturnType<typeof getHomepageData>>['banners'][0];
type Statistics = NonNullable<
    Awaited<ReturnType<typeof getHomepageData>>['statistics']
>;
type Facility = Awaited<ReturnType<typeof getHomepageData>>['facilities'][0];

function BannersTab({
    data,
    refreshData,
}: {
    data: Banner[];
    refreshData: () => void;
}) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (editingBanner) {
            setPreview(editingBanner.imageUrl);
        } else {
            setPreview(null);
        }
    }, [editingBanner]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = editingBanner
                ? await updateBanner(
                      editingBanner.id,
                      editingBanner.imageUrl,
                      formData,
                  )
                : await createBanner(formData);

            if (result.success) {
                toast({
                    title: `Banner ${editingBanner ? 'diperbarui' : 'dibuat'}!`,
                    description: 'Halaman beranda telah diperbarui.',
                });
                refreshData();
                setDialogOpen(false);
            } else {
                toast({
                    title: 'Gagal!',
                    description: result.error,
                    variant: 'destructive',
                });
            }
        });
    };

    const handleDelete = (id: string, imageUrl: string | null) => {
        startTransition(async () => {
            const result = await deleteBanner(id, imageUrl);
            if (result.success) {
                toast({
                    title: 'Banner dihapus!',
                    description: 'Data banner telah dihapus.',
                });
                refreshData();
            } else {
                toast({
                    title: 'Gagal!',
                    description: result.error,
                    variant: 'destructive',
                });
            }
        });
    };

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-2xl font-bold">
                        Kelola Banner
                    </CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                        Tambah, edit, atau hapus banner di halaman utama.
                    </CardDescription>
                </div>
                <Button
                    onClick={() => {
                        setEditingBanner(null);
                        setDialogOpen(true);
                    }}
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Tambah Banner
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                                Gambar
                            </TableHead>
                            <TableHead className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                                Judul
                            </TableHead>
                            <TableHead className="px-6 py-3 text-right text-sm font-medium uppercase tracking-wider">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                    <Image
                                        src={item.imageUrl || ''}
                                        alt={item.title}
                                        width={160}
                                        height={90}
                                        className="rounded-md bg-muted object-cover"
                                    />
                                </TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap font-medium text-base">
                                    {item.title}
                                </TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                setEditingBanner(item);
                                                setDialogOpen(true);
                                            }}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Anda yakin?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Tindakan ini tidak bisa
                                                        dibatalkan. Ini akan
                                                        menghapus banner secara
                                                        permanen.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Batal
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id,
                                                                item.imageUrl,
                                                            )
                                                        }
                                                        disabled={isPending}
                                                    >
                                                        {isPending
                                                            ? 'Menghapus...'
                                                            : 'Hapus'}
                                                    </AlertDialogAction>
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
            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) {
                        setEditingBanner(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingBanner ? 'Edit' : 'Tambah'} Banner
                        </DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={handleFormSubmit}
                        className="grid gap-4 py-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="title">Judul</Label>
                            <Input
                                id="title"
                                name="title"
                                defaultValue={editingBanner?.title}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={editingBanner?.description}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Gambar</Label>
                            <div className="mt-1 flex items-center gap-4">
                                {preview ? (
                                    <Image
                                        src={preview}
                                        alt="Preview"
                                        width={120}
                                        height={67}
                                        className="rounded-md object-cover"
                                    />
                                ) : (
                                    <div className="flex h-[67px] w-[120px] items-center justify-center rounded-md bg-muted">
                                        <p className="text-sm text-muted-foreground">
                                            Pilih Gambar
                                        </p>
                                    </div>
                                )}
                                <Input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="max-w-xs"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Batal
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

function StatisticsTab({
    data,
    refreshData,
}: {
    data: Statistics | null;
    refreshData: () => void;
}) {
    const [stats, setStats] = useState(
        data || { classrooms: 0, students: 0, teachers: 0, staff: 0 },
    );
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setStats(data || { classrooms: 0, students: 0, teachers: 0, staff: 0 });
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setStats((prev) => ({ ...prev, [name]: Number(value) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const result = await updateStatistics(stats);
            if (result.success) {
                toast({
                    title: 'Statistik diperbarui!',
                    description:
                        'Data statistik di halaman beranda telah diperbarui.',
                });
                refreshData();
            } else {
                toast({
                    title: 'Gagal!',
                    description: result.error,
                    variant: 'destructive',
                });
            }
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Data Statistik Sekolah
                    </CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                        Perbarui data statistik yang ditampilkan di halaman
                        beranda.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="classrooms" className="text-lg">
                            Jumlah Ruang Kelas
                        </Label>
                        <Input
                            id="classrooms"
                            name="classrooms"
                            type="number"
                            value={stats.classrooms}
                            onChange={handleChange}
                            required
                            className="text-base"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="students" className="text-lg">
                            Jumlah Siswa
                        </Label>
                        <Input
                            id="students"
                            name="students"
                            type="number"
                            value={stats.students}
                            onChange={handleChange}
                            required
                            className="text-base"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="teachers" className="text-lg">
                            Jumlah Guru
                        </Label>
                        <Input
                            id="teachers"
                            name="teachers"
                            type="number"
                            value={stats.teachers}
                            onChange={handleChange}
                            required
                            className="text-base"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="staff" className="text-lg">
                            Jumlah Staf
                        </Label>
                        <Input
                            id="staff"
                            name="staff"
                            type="number"
                            value={stats.staff}
                            onChange={handleChange}
                            required
                            className="text-base"
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Menyimpan...' : 'Simpan Statistik'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}

function FacilitiesTab({
    data,
    refreshData,
}: {
    data: Facility[];
    refreshData: () => void;
}) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editingFacility, setEditingFacility] = useState<Facility | null>(
        null,
    );
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (editingFacility) {
            setPreview(editingFacility.imageUrl);
        } else {
            setPreview(null);
        }
    }, [editingFacility]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = editingFacility
                ? await updateFacility(
                      editingFacility.id,
                      editingFacility.imageUrl,
                      formData,
                  )
                : await createFacility(formData);

            if (result.success) {
                toast({
                    title: `Fasilitas ${
                        editingFacility ? 'diperbarui' : 'dibuat'
                    }!`,
                    description: 'Data fasilitas telah diperbarui.',
                });
                refreshData();
                setDialogOpen(false);
            } else {
                toast({
                    title: 'Gagal!',
                    description: result.error,
                    variant: 'destructive',
                });
            }
        });
    };

    const handleDelete = (id: string, imageUrl: string | null) => {
        startTransition(async () => {
            const result = await deleteFacility(id, imageUrl);
            if (result.success) {
                toast({ title: 'Fasilitas dihapus!' });
                refreshData();
            } else {
                toast({
                    title: 'Gagal!',
                    description: result.error,
                    variant: 'destructive',
                });
            }
        });
    };

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-2xl font-bold">
                        Kelola Fasilitas
                    </CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                        Tambah, edit, atau hapus fasilitas sekolah.
                    </CardDescription>
                </div>
                <Button
                    onClick={() => {
                        setEditingFacility(null);
                        setDialogOpen(true);
                    }}
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Tambah Fasilitas
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                                Gambar
                            </TableHead>
                            <TableHead className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                                Nama Fasilitas
                            </TableHead>
                            <TableHead className="px-6 py-3 text-right text-sm font-medium uppercase tracking-wider">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        width={160}
                                        height={90}
                                        className="rounded-md bg-muted object-cover"
                                    />
                                </TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap font-medium text-base">
                                    {item.name}
                                </TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                setEditingFacility(item);
                                                setDialogOpen(true);
                                            }}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Anda yakin?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Tindakan ini akan
                                                        menghapus fasilitas
                                                        secara permanen.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Batal
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id,
                                                                item.imageUrl,
                                                            )
                                                        }
                                                        disabled={isPending}
                                                    >
                                                        {isPending
                                                            ? 'Menghapus...'
                                                            : 'Hapus'}
                                                    </AlertDialogAction>
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
            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) {
                        setEditingFacility(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingFacility ? 'Edit' : 'Tambah'} Fasilitas
                        </DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={handleFormSubmit}
                        className="grid gap-4 py-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-base">
                                Nama Fasilitas
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={editingFacility?.name}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-base">Gambar</Label>
                            <div className="mt-1 flex items-center gap-4">
                                {preview ? (
                                    <Image
                                        src={preview}
                                        alt="Preview"
                                        width={120}
                                        height={80}
                                        className="rounded-md object-cover"
                                    />
                                ) : (
                                    <div className="flex h-[80px] w-[120px] items-center justify-center rounded-md bg-muted">
                                        <p className="text-sm text-muted-foreground">
                                            Pilih Gambar
                                        </p>
                                    </div>
                                )}
                                <Input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="max-w-xs"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Batal
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

export default function HomepageAdminPage() {
    const [loading, setLoading] = useState(true);
    const [homepageData, setHomepageData] = useState<Awaited<
        ReturnType<typeof getHomepageData>
    > | null>(null);

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
            <div className="space-y-8">
                <h1 className="text-2xl font-bold">Kelola Halaman Beranda</h1>
                <p className="text-muted-foreground">
                    Memuat data manajemen beranda...
                </p>
                {/* TODO: Add skeleton loaders for a better UX */}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Kelola Halaman Beranda</h1>
                <p className="text-muted-foreground">
                    Kelola semua konten yang ada di halaman beranda dari satu
                    tempat.
                </p>
            </div>
            <Tabs defaultValue="banners" className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    <TabsTrigger value="banners">Banner</TabsTrigger>
                    <TabsTrigger value="statistics">Statistik</TabsTrigger>
                    <TabsTrigger value="facilities">Fasilitas</TabsTrigger>
                </TabsList>
                <TabsContent value="banners" className="mt-6">
                    <BannersTab
                        data={homepageData.banners}
                        refreshData={fetchData}
                    />
                </TabsContent>
                <TabsContent value="statistics" className="mt-6">
                    <StatisticsTab
                        data={homepageData.statistics}
                        refreshData={fetchData}
                    />
                </TabsContent>
                <TabsContent value="facilities" className="mt-6">
                    <FacilitiesTab
                        data={homepageData.facilities}
                        refreshData={fetchData}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
