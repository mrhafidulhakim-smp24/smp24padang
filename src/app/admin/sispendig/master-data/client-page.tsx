'use client';

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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    createJenisSampah,
    deleteJenisSampah,
    updateJenisSampah,
} from '../actions';

type JenisSampah = {
    id: number;
    namaSampah: string;
    kategori: 'organik' | 'anorganik';
    hargaPerKg: number;
    createdAt: Date;
    updatedAt: Date;
};

interface MasterDataClientProps {
    initialData: JenisSampah[];
}

export default function MasterDataClient({
    initialData,
}: MasterDataClientProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [jenisSampahList, setJenisSampahList] =
        useState<JenisSampah[]>(initialData);
    const [editing, setEditing] = useState<JenisSampah | null>(null);
    const [formData, setFormData] = useState({
        namaSampah: '',
        hargaPerKg: '',
        kategori: 'anorganik' as 'organik' | 'anorganik',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editing) {
                const result = await updateJenisSampah(editing.id, {
                    namaSampah: formData.namaSampah,
                    hargaPerKg: parseFloat(formData.hargaPerKg),
                    kategori: formData.kategori,
                });
                if (result.success) {
                    toast({
                        title: 'Sukses',
                        description: 'Jenis sampah berhasil diperbarui',
                    });
                } else {
                    throw new Error(result.error);
                }
            } else {
                const result = await createJenisSampah({
                    namaSampah: formData.namaSampah,
                    hargaPerKg: parseFloat(formData.hargaPerKg),
                    kategori: formData.kategori,
                });
                if (result.success) {
                    toast({
                        title: 'Sukses',
                        description: 'Jenis sampah berhasil ditambahkan',
                    });
                } else {
                    throw new Error(result.error);
                }
            }
            setFormData({ namaSampah: '', hargaPerKg: '', kategori: 'anorganik' });
            setEditing(null);
            // Refresh data after successful operation
            router.refresh();
        } catch (error: unknown) {
            toast({
                title: 'Error',
            description: error instanceof Error ? error.message : 'Terjadi kesalahan',
                variant: 'destructive',
            });
        }
    };

    const handleEdit = (item: JenisSampah) => {
        setEditing(item);
        setFormData({
            namaSampah: item.namaSampah,
            hargaPerKg: item.hargaPerKg.toString(),
            kategori: item.kategori,
        });
    };

    const handleDelete = async (id: number) => {
        try {
            const result = await deleteJenisSampah(id);
            if (result.success) {
                toast({
                    title: 'Sukses',
                    description: 'Jenis sampah berhasil dihapus',
                });
                // Refresh data after successful deletion
                router.refresh();
            } else {
                throw new Error(result.error);
            }
        } catch (error: unknown) {
            toast({
                title: 'Error',
            description: error instanceof Error ? error.message : 'Gagal menghapus jenis sampah',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>
                        {editing ? 'Edit' : 'Tambah'} Jenis Sampah
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="namaSampah">Nama Sampah</Label>
                                <Input
                                    id="namaSampah"
                                    value={formData.namaSampah}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            namaSampah: e.target.value,
                                        }))
                                    }
                                    placeholder="Masukkan nama jenis sampah"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hargaPerKg">
                                    Harga per Kg (Rp)
                                </Label>
                                <Input
                                    id="hargaPerKg"
                                    type="number"
                                    step="0.01"
                                    value={formData.hargaPerKg}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            hargaPerKg: e.target.value,
                                        }))
                                    }
                                    placeholder="Masukkan harga per kg"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Kategori</Label>
                                <Select
                                    value={formData.kategori}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            kategori: value as 'organik' | 'anorganik',
                                        }))
                                    }
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="organik">Organik</SelectItem>
                                        <SelectItem value="anorganik">Anorganik</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit">
                                {editing ? 'Update' : 'Simpan'}
                            </Button>
                            {editing && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setEditing(null);
                                        setFormData({
                                            namaSampah: '',
                                            hargaPerKg: '',
                                            kategori: 'anorganik',
                                        });
                                    }}
                                >
                                    Batal
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Jenis Sampah</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="hidden md:block w-full table-container-3d">
                        <Table className="min-w-[650px] w-full">
                            <TableHeader>
                                <TableRow className="bg-muted/50 border-b">
                                    <TableHead className="font-semibold text-foreground py-3.5 px-4">Nama Sampah</TableHead>
                                    <TableHead className="font-semibold text-foreground py-3.5 px-4">Harga per Kg</TableHead>
                                    <TableHead className="font-semibold text-foreground py-3.5 px-4">Kategori</TableHead>
                                    <TableHead className="font-semibold text-foreground py-3.5 px-4">Terakhir Diperbarui</TableHead>
                                    <TableHead className="w-[100px] text-right font-semibold text-foreground py-3.5 px-4">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {jenisSampahList.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-muted/40 transition-colors">
                                        <TableCell className="font-semibold text-foreground px-4 py-3">{item.namaSampah}</TableCell>
                                        <TableCell className="font-medium text-primary px-4 py-3">
                                            Rp{' '}
                                            {item.hargaPerKg.toLocaleString(
                                                'id-ID',
                                            )}
                                        </TableCell>
                                        <TableCell className="capitalize px-4 py-3">
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                item.kategori === 'organik' ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                                            }`}>
                                                {item.kategori}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground px-4 py-3">
                                            {new Date(
                                                item.updatedAt,
                                            ).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </TableCell>
                                        <TableCell className="text-right px-4 py-3">
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 w-8 p-0 btn-3d"
                                                    title="Edit"
                                                    onClick={() =>
                                                        handleEdit(item)
                                                    }
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="h-8 w-8 p-0 btn-3d"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Hapus Jenis
                                                                Sampah?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Tindakan ini
                                                                tidak dapat
                                                                dibatalkan. Data
                                                                sampah yang
                                                                terkait juga
                                                                akan dihapus.
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
                                                                    )
                                                                }
                                                                className="bg-destructive hover:bg-destructive/90"
                                                            >
                                                                Hapus
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
                    </div>

                    {/* Mobile Card Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                        {jenisSampahList.map((item) => (
                            <Card key={item.id} className="card-3d card-3d-hover">
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between items-start gap-2 border-b border-border/60 pb-2.5">
                                        <div>
                                            <p className="font-bold text-base text-foreground">{item.namaSampah}</p>
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${
                                                item.kategori === 'organik' ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                                            }`}>
                                                {item.kategori}
                                            </span>
                                        </div>
                                        <span className="font-bold text-primary text-base">
                                            Rp {item.hargaPerKg.toLocaleString('id-ID')}/kg
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full btn-3d"
                                            onClick={() => handleEdit(item)}
                                        >
                                            <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="w-full btn-3d"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Hapus
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Hapus Jenis Sampah?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Tindakan ini tidak dapat dibatalkan.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(item.id)}
                                                        className="bg-destructive hover:bg-destructive/90"
                                                    >
                                                        Hapus
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
