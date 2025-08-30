'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { createPastPrincipal, updatePastPrincipal, deletePastPrincipal } from '../actions';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import type { pastPrincipals as PastPrincipal } from '@/lib/db/schema';
import { type InferSelectModel } from 'drizzle-orm';

type Principal = InferSelectModel<typeof PastPrincipal>;

type PastPrincipalsListProps = {
    initialData: Principal[];
};

export default function PastPrincipalsList({ initialData }: PastPrincipalsListProps) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [principals, setPrincipals] = useState(initialData);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [selectedPrincipal, setSelectedPrincipal] = useState<Principal | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const openDialog = (principal: Principal | null) => {
        setSelectedPrincipal(principal);
        setPreview(principal?.imageUrl || null);
        setImageFile(null);
        setDialogOpen(true);
    };

    const openDeleteDialog = (principal: Principal) => {
        setSelectedPrincipal(principal);
        setDeleteOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        startTransition(async () => {
            const result = selectedPrincipal
                ? await updatePastPrincipal(selectedPrincipal.id, selectedPrincipal.imageUrl, formData)
                : await createPastPrincipal(formData);

            if (result.success) {
                toast({ title: 'Sukses!', description: result.message });
                // This is a simple way to refresh data. For a better UX, you might want to optimistically update the state.
                window.location.reload(); 
            } else {
                toast({ title: 'Gagal!', description: result.message, variant: 'destructive' });
            }
        });
    };

    const handleDelete = () => {
        if (!selectedPrincipal) return;
        startTransition(async () => {
            const result = await deletePastPrincipal(selectedPrincipal.id, selectedPrincipal.imageUrl);
            if (result.success) {
                toast({ title: 'Sukses!', description: result.message });
                setPrincipals(principals.filter(p => p.id !== selectedPrincipal.id));
                setDeleteOpen(false);
            } else {
                toast({ title: 'Gagal!', description: result.message, variant: 'destructive' });
            }
        });
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button onClick={() => openDialog(null)}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Baru</Button>
            </div>
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Foto</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Periode</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {principals.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell>
                                    <Image src={p.imageUrl || 'https://placehold.co/100x100.png'} alt={p.name} width={60} height={60} className="rounded-md object-cover bg-muted" />
                                </TableCell>
                                <TableCell className="font-medium">{p.name}</TableCell>
                                <TableCell>{p.period}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="icon" className="mr-2" onClick={() => openDialog(p)}><Pencil className="h-4 w-4" /></Button>
                                    <Button variant="destructive" size="icon" onClick={() => openDeleteDialog(p)}><Trash2 className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedPrincipal ? 'Edit' : 'Tambah'} Riwayat Kepala Sekolah</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama</Label>
                            <Input id="name" name="name" defaultValue={selectedPrincipal?.name} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="period">Periode</Label>
                            <Input id="period" name="period" placeholder="Contoh: 2020 - 2024" defaultValue={selectedPrincipal?.period} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Foto</Label>
                            {preview && <Image src={preview} alt="Preview" width={100} height={100} className="rounded-md object-cover bg-muted" />}
                            <Input type="file" name="image" accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setImageFile(file);
                                    setPreview(URL.createObjectURL(file));
                                }
                            }} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={isPending}>{isPending ? 'Menyimpan...' : 'Simpan'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>Tindakan ini akan menghapus data secara permanen.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isPending}>{isPending ? 'Menghapus...' : 'Hapus'}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
