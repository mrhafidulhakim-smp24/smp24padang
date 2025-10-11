'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
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
import { Pencil, Trash2, Plus, Printer, Save } from 'lucide-react';
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
    createSetoranGuru,
    deleteSetoranGuru,
    getSetoranGuru,
    updateSetoranGuru,
    getSetoranGuruByGuru,
} from '../setoran-guru-actions';
import { getAllGurus } from '../actions';
import { deleteGuru } from '../guru-actions';

import { GuruDialog } from './guru-dialog';
import { SubmitButton } from './submit-button';
import type { JenisSampah, Guru, SetoranGuruEntry } from './types';

interface TabSetoranGuruProps {
    jenisSampah: JenisSampah[];
    gurus: Guru[];
    initialSetoranGuru: SetoranGuruEntry[];
}

export function TabSetoranGuru({
    jenisSampah,
    gurus: initialGurus,
    initialSetoranGuru,
}: TabSetoranGuruProps) {
    const { toast } = useToast();
    const [gurus, setGurus] = useState(initialGurus);
    const [setoranList, setSetoranList] = useState(initialSetoranGuru);
    const printRef = useRef<HTMLDivElement>(null);

    // State for managing teacher deposits modal
    const [manageGuru, setManageGuru] = useState<Guru | null>(null);
    const [entries, setEntries] = useState<SetoranGuruEntry[]>([]);
    const [loadingEntries, setLoadingEntries] = useState(false); // Loading state for dialog
    const [editingEntryId, setEditingEntryId] = useState<number | null>(null);
    const [editedEntry, setEditedEntry] = useState<Partial<SetoranGuruEntry>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [deleteEntryDialog, setDeleteEntryDialog] =
        useState<SetoranGuruEntry | null>(null);

    // State for managing teachers
    const [guruModalOpen, setGuruModalOpen] = useState(false);
    const [editingGuru, setEditingGuru] = useState<Guru | null>(null);
    const [deletingGuru, setDeletingGuru] = useState<Guru | null>(null);

    const [addState, addAction] = useFormState(createSetoranGuru, {
        message: null,
        errors: {},
        success: false,
    });
    const addFormRef = useRef<HTMLFormElement>(null);

    const refetchGurus = async () => {
        const res = await getAllGurus();
        if (res.data) {
            setGurus(res.data);
        }
    };

    // Revamped function to fetch entries for the dialog
    const fetchGuruEntries = async (guruId: number) => {
        setLoadingEntries(true);
        setEntries([]); // Clear previous entries
        try {
            const res = await getSetoranGuruByGuru(guruId);
            if (res.data) {
                setEntries(res.data);
            } else if (res.error) {
                toast({
                    title: 'Gagal Memuat Setoran',
                    description: res.error,
                    variant: 'destructive',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Terjadi kesalahan saat mengambil data.',
                variant: 'destructive',
            });
        } finally {
            setLoadingEntries(false);
        }
    };

    const openManageGuru = (guru: Guru) => {
        setManageGuru(guru);
        fetchGuruEntries(guru.id);
    };

    useEffect(() => {
        if (addState.message) {
            if (addState.success) {
                toast({ title: 'Sukses', description: addState.message });
                addFormRef.current?.reset();
                refetchAllSetoran();
                if (manageGuru) {
                    fetchGuruEntries(manageGuru.id);
                }
            } else {
                toast({
                    title: 'Gagal',
                    description: addState.message,
                    variant: 'destructive',
                });
            }
        }
    }, [addState, toast, manageGuru]);

    const refetchAllSetoran = async () => {
        const updatedSetoran = await getSetoranGuru();
        if (updatedSetoran.data) setSetoranList(updatedSetoran.data);
    };

    const guruSummary = useMemo(() => {
        const summary = gurus.map((guru) => {
            const guruSetoran = setoranList.filter((s) => s.guruId === guru.id);
            const totalKg = guruSetoran.reduce(
                (acc, s) => acc + Number(s.jumlahKg),
                0,
            );
            const totalValue = guruSetoran.reduce(
                (acc, s) =>
                    acc + Number(s.jumlahKg) * Number(s.hargaPerKg || 0),
                0,
            );
            return {
                ...guru,
                totalKg,
                totalValue,
                setoranCount: guruSetoran.length,
            };
        });
        return summary;
    }, [gurus, setoranList]);

    const handlePrint = () => {
        window.print();
    };

    const startEditEntry = (entry: SetoranGuruEntry) => {
        setEditingEntryId(entry.id);
        setEditedEntry(entry);
    };

    const cancelEditEntry = () => {
        setEditingEntryId(null);
        setEditedEntry({});
    };

    const handleSaveEntry = async (entryId: number) => {
        setIsSaving(true);

        const jenisId = editedEntry.jenisSampahId;
        const jumlah = parseFloat(String(editedEntry.jumlahKg) || '0');

        if (!jenisId || !jumlah) {
            toast({
                title: 'Gagal',
                description: 'Jenis sampah dan jumlah harus diisi dan valid.',
                variant: 'destructive',
            });
            setIsSaving(false);
            return;
        }

        const result = await updateSetoranGuru(
            entryId,
            {
                jenisSampahId: jenisId,
                jumlahKg: jumlah
            }
        );
        if (result.success) {
            toast({ title: 'Sukses', description: result.message });
            cancelEditEntry();
            refetchAllSetoran();
            if (manageGuru) {
                fetchGuruEntries(manageGuru.id);
            }
        } else {
            toast({
                title: 'Gagal',
                description: result.message,
                variant: 'destructive',
            });
        }
        setIsSaving(false);
    };

    const handleDeleteEntry = async (entryId: number) => {
        const result = await deleteSetoranGuru(entryId);
        if (result.success) {
            toast({ title: 'Sukses', description: result.message });
            refetchAllSetoran();
            if (manageGuru) {
                fetchGuruEntries(manageGuru.id);
            }
        } else {
            toast({
                title: 'Gagal',
                description: result.message,
                variant: 'destructive',
            });
        }
        setDeleteEntryDialog(null);
    };

    const handleDeleteGuru = async (id: number) => {
        const result = await deleteGuru(id);
        if (result.success) {
            toast({ title: 'Sukses', description: result.message });
            refetchGurus();
            refetchAllSetoran();
        } else {
            toast({
                title: 'Gagal',
                description: result.message,
                variant: 'destructive',
            });
        }
        setDeletingGuru(null);
    };

    return (
        <div>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between print:hidden">
                        <div>
                            <CardTitle className="text-xl font-bold">
                                Riwayat Setoran Guru
                            </CardTitle>
                            <p className="text-muted-foreground">
                                Kelola data setoran dari setiap guru.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => {
                                    setEditingGuru(null);
                                    setGuruModalOpen(true);
                                }}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Tambah Guru
                            </Button>
                            <Button onClick={handlePrint}>
                                <Printer className="mr-2 h-4 w-4" /> Cetak
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div ref={printRef}>
                        <div className="hidden print:block text-center mb-4">
                            <h1 className="text-xl font-bold">
                                Laporan Setoran Guru
                            </h1>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Guru</TableHead>
                                    <TableHead>Jumlah Setoran</TableHead>
                                    <TableHead>Total (Kg)</TableHead>
                                    <TableHead>Total (Rp)</TableHead>
                                    <TableHead className="text-right print:hidden">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {guruSummary.length > 0 ? (
                                    guruSummary.map((guru) => (
                                        <TableRow key={guru.id}>
                                            <TableCell className="font-medium">
                                                {guru.namaGuru}
                                            </TableCell>
                                            <TableCell>
                                                {guru.setoranCount}
                                            </TableCell>
                                            <TableCell>
                                                {guru.totalKg.toLocaleString(
                                                    'id-ID',
                                                    {
                                                        maximumFractionDigits: 2,
                                                    },
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                Rp{' '}
                                                {guru.totalValue.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right print:hidden">
                                                <div className="flex gap-2 justify-end">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        title="Kelola Setoran"
                                                        onClick={() =>
                                                            openManageGuru(guru)
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        title="Hapus Guru"
                                                        onClick={() =>
                                                            setDeletingGuru(guru)
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-24 text-center"
                                        >
                                            Belum ada data guru.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Manage Teacher Deposits Dialog */}
            <Dialog
                open={!!manageGuru}
                onOpenChange={(open) => {
                    if (!open) {
                        setManageGuru(null);
                        setEntries([]); // Clear entries on close
                    }
                }}
            >
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>
                            Kelola Setoran: {manageGuru?.namaGuru}
                        </DialogTitle>
                        <DialogDescription>
                            Tambah atau edit setoran untuk guru ini.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        action={addAction}
                        ref={addFormRef}
                        className="grid grid-cols-1 sm:grid-cols-5 gap-2 border-b pb-4"
                    >
                        <input
                            type="hidden"
                            name="guruId"
                            value={manageGuru?.id}
                        />
                        <div className="sm:col-span-2">
                            <Label>Jenis Sampah</Label>
                            <Select name="jenisSampahId" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih jenis" />
                                </SelectTrigger>
                                <SelectContent>
                                    {jenisSampah.map((j) => (
                                        <SelectItem
                                            key={j.id}
                                            value={String(j.id)}
                                        >
                                            {j.namaSampah}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="sm:col-span-2">
                            <Label>Jumlah (Kg)</Label>
                            <Input
                                name="jumlahKg"
                                type="number"
                                step="0.01"
                                required
                            />
                        </div>
                        <div className="sm:col-span-1 flex items-end">
                            <SubmitButton pendingText="Menambah...">
                                <Plus className="h-4 w-4 mr-1" /> Tambah
                            </SubmitButton>
                        </div>
                    </form>

                    <div className="overflow-x-auto rounded border mt-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Jenis</TableHead>
                                    <TableHead>Jumlah (Kg)</TableHead>
                                    <TableHead>Total (Rp)</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead className="w-[120px]">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loadingEntries ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center py-6"
                                        >
                                            Memuat...
                                        </TableCell>
                                    </TableRow>
                                ) : entries.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center py-6"
                                        >
                                            Belum ada setoran
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    entries.map((e) => {
                                        const isEditing =
                                            editingEntryId === e.id;
                                        return (
                                            <TableRow key={e.id}>
                                                <div className="contents">
                                                    {isEditing ? (
                                                        <>
                                                            <TableCell>
                                                                <Select
                                                                    name="jenisSampahId"
                                                                    value={editedEntry.jenisSampahId?.toString()}
                                                                    onValueChange={(value) => {
                                                                        setEditedEntry(prev => ({ ...prev, jenisSampahId: parseInt(value) }));
                                                                    }}
                                                                    required
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {jenisSampah.map(
                                                                            (
                                                                                j,
                                                                            ) => (
                                                                                <SelectItem
                                                                                    key={
                                                                                        j.id
                                                                                    }
                                                                                    value={String(
                                                                                        j.id,
                                                                                    )}
                                                                                >
                                                                                    {
                                                                                        j.namaSampah
                                                                                    }
                                                                                </SelectItem>
                                                                            ),
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    name="jumlahKg"
                                                                    type="number"
                                                                    step="0.01"
                                                                    value={editedEntry.jumlahKg}
                                                                    onChange={(ev) => {
                                                                        setEditedEntry(prev => ({ ...prev, jumlahKg: ev.target.value }));
                                                                    }}
                                                                    required
                                                                />
                                                            </TableCell>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <TableCell>
                                                                {e.jenisSampah}
                                                            </TableCell>
                                                            <TableCell>
                                                                {Number(
                                                                    e.jumlahKg,
                                                                ).toLocaleString(
                                                                    'id-ID',
                                                                )}
                                                            </TableCell>
                                                        </>
                                                    )}
                                                    <TableCell>
                                                        Rp{' '}
                                                        {Number(
                                                            Number(e.jumlahKg) *
                                                                Number(
                                                                    e.hargaPerKg ||
                                                                        0,
                                                                ),
                                                        ).toLocaleString(
                                                            'id-ID',
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(
                                                            e.createdAt,
                                                        ).toLocaleDateString(
                                                            'id-ID',
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            {isEditing ? (
                                                                <>
                                                                    <Button
                                                                        size="icon"
                                                                        disabled={isSaving}
                                                                        onClick={() => handleSaveEntry(e.id)}
                                                                    >
                                                                        {isSaving ? "..." : <Save className="h-4 w-4" />}
                                                                    </Button>
                                                                    <Button
                                                                        size="icon"
                                                                        variant="outline"
                                                                        type="button"
                                                                        onClick={
                                                                            cancelEditEntry
                                                                        }
                                                                    >
                                                                        Batal
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Button
                                                                        size="icon"
                                                                        variant="outline"
                                                                        type="button"
                                                                        onClick={() =>
                                                                            startEditEntry(e)
                                                                        }
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        size="icon"
                                                                        variant="destructive"
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setDeleteEntryDialog(
                                                                                e,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </div>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Setoran Entry Dialog */}
            <AlertDialog
                open={!!deleteEntryDialog}
                onOpenChange={(open) => {
                    if (!open) setDeleteEntryDialog(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus data setoran ini secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleDeleteEntry(deleteEntryDialog!.id)}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Guru Dialog */}
            <AlertDialog
                open={!!deletingGuru}
                onOpenChange={(open) => {
                    if (!open) setDeletingGuru(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus guru '{
                                deletingGuru?.namaGuru
                            }'
                            secara permanen. Semua data setoran terkait juga
                            akan terhapus.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleDeleteGuru(deletingGuru!.id)}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <GuruDialog
                isOpen={guruModalOpen}
                onClose={() => {
                    setGuruModalOpen(false);
                    setEditingGuru(null);
                }}
                guru={editingGuru}
                onSuccess={() => {
                    refetchGurus();
                    refetchAllSetoran();
                }}
            />
        </div>
    );
}
