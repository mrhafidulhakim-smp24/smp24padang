'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
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
    DialogFooter,
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
} from '@/components/ui/alert-dialog';
import {
    createPastPrincipal,
    updatePastPrincipal,
    deletePastPrincipal,
    getPastPrincipals,
} from '@/app/admin/profile/principal/actions';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import type { pastPrincipals as PastPrincipal } from '@/lib/db/schema';
import { type InferSelectModel } from 'drizzle-orm';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import useSWR from 'swr';

type Principal = InferSelectModel<typeof PastPrincipal>;

type PastPrincipalsListProps = {};

export default function PastPrincipalsList() {
    const { toast } = useToast();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const { data, error, isLoading, mutate } = useSWR(
        'pastPrincipals',
        getPastPrincipals,
    );
    const principals: Principal[] = data?.success ? data.data : [];

    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [selectedPrincipal, setSelectedPrincipal] =
        useState<Principal | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [dialogErrors, setDialogErrors] = useState<
        Record<string, string[] | undefined>
    >({});

    const openDialog = (principal: Principal | null) => {
        setSelectedPrincipal(principal);
        setPreview(principal?.imageUrl || null);
        setImageFile(null);
        setDialogErrors({}); // Clear errors when opening dialog
        setDialogOpen(true);
    };

    const openDeleteDialog = (principal: Principal) => {
        setSelectedPrincipal(principal);
        setDeleteOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setDialogErrors({}); // Clear previous errors
        const formData = new FormData(e.currentTarget);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        startTransition(async () => {
            const result = selectedPrincipal
                ? await updatePastPrincipal(
                      selectedPrincipal.id,
                      selectedPrincipal.imageUrl,
                      formData,
                  )
                : await createPastPrincipal(formData);

            if (result.success) {
                toast({ title: 'Sukses!', description: result.message });
                setDialogOpen(false);
                mutate();
                setDialogErrors({}); // Clear errors on success
            } else {
                if (result.errors) {
                    setDialogErrors(result.errors);
                    toast({
                        title: 'Validasi Gagal',
                        description: 'Mohon periksa kembali isian form.',
                        variant: 'destructive',
                    });
                } else if (result.message) {
                    toast({
                        title: 'Gagal!',
                        description: result.message,
                        variant: 'destructive',
                    });
                } else {
                    toast({
                        title: 'Gagal!',
                        description: 'Terjadi kesalahan tak terduga.',
                        variant: 'destructive',
                    });
                }
            }
        });
    };

    const handleDelete = () => {
        if (!selectedPrincipal) return;
        startTransition(async () => {
            const result = await deletePastPrincipal(
                selectedPrincipal.id,
                selectedPrincipal.imageUrl,
            );
            if (result.success) {
                toast({ title: 'Sukses!', description: result.message });
                setDeleteOpen(false);
                mutate();
            } else {
                toast({
                    title: 'Gagal!',
                    description: result.message,
                    variant: 'destructive',
                });
            }
        });
    };

    if (isLoading) return <div>Loading past principals...</div>;
    if (error || !data?.success)
        return <div>Failed to load past principals.</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Riwayat Kepala Sekolah</CardTitle>
                <div className="flex justify-between items-center">
                    <CardDescription>
                        Kelola daftar kepala sekolah yang pernah menjabat.
                    </CardDescription>
                    <Button onClick={() => openDialog(null)}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Riwayat
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">
                                    Foto
                                </TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Periode</TableHead>
                                <TableHead className="text-right">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {principals.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>
                                        <Image
                                            src={
                                                p.imageUrl ||
                                                'https://placehold.co/100x100.png'
                                            }
                                            alt={p.name}
                                            width={64}
                                            height={64}
                                            className="rounded-md object-cover bg-muted"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium text-base">
                                        {p.name}
                                    </TableCell>
                                    <TableCell className="text-base">
                                        {p.period}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="mr-2"
                                                onClick={() => openDialog(p)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() =>
                                                    openDeleteDialog(p)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedPrincipal ? 'Edit' : 'Tambah'} Riwayat
                            Kepala Sekolah
                        </DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={handleFormSubmit}
                        className="grid gap-6 py-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-base">
                                Nama
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={selectedPrincipal?.name}
                                required
                                className="text-base"
                            />
                            {dialogErrors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {dialogErrors.name[0]}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="period" className="text-base">
                                Periode
                            </Label>
                            <Input
                                id="period"
                                name="period"
                                placeholder="Contoh: 2020 - 2024"
                                defaultValue={selectedPrincipal?.period}
                                required
                                className="text-base"
                            />
                            {dialogErrors.period && (
                                <p className="text-red-500 text-sm mt-1">
                                    {dialogErrors.period[0]}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-base">Foto</Label>
                            {preview && (
                                <Image
                                    src={preview}
                                    alt="Preview"
                                    width={100}
                                    height={100}
                                    className="rounded-md object-cover bg-muted"
                                />
                            )}
                            <Input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setImageFile(file);
                                        setPreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus data secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isPending}
                        >
                            {isPending ? 'Menghapus...' : 'Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
