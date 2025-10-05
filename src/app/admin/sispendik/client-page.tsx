'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
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
import { Pencil, Trash2, Plus, Printer, Save, RotateCcw } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Actions for Class Deposits
import {
    createJenisSampah,
    deleteJenisSampah,
    getClassTotals,
    getTotalsSummary,
    updateJenisSampah,
    getSampahKelasByKelasMonth,
    createSampahKelas,
    updateSampahKelas,
    deleteSampahKelasRecord,
    resetClassDepositsByMonth,
    getAllGurus,
} from './actions';

// Actions for Teacher Deposits
import {
    createSetoranGuru,
    deleteSetoranGuru,
    getSetoranGuru,
    updateSetoranGuru,
    getSetoranGuruByGuru,
} from './setoran-guru-actions';
import {
    createGuru,
    updateGuru,
    deleteGuru,
    State as GuruState,
} from './guru-actions';
import {
    guruSispendik,
    jenisSampah as jenisSampahTable,
} from '@/lib/db/schema';

// Create Zod schemas from Drizzle tables
const JenisSampahSchema = createSelectSchema(jenisSampahTable);
const GuruSchema = createSelectSchema(guruSispendik);

// --- TYPE DEFINITIONS ---
type JenisSampah = z.infer<typeof JenisSampahSchema>;
type Guru = z.infer<typeof GuruSchema>;

interface Kelas {
    id: number;
    tingkat: number;
    huruf: string;
}

interface SetoranEntry {
    id: number;
    jenisSampah: string;
    jenisSampahId: number;
    jumlahKg: string | number;
    hargaPerKg: string | number;
    createdAt: string | Date | null;
}

interface SetoranGuruEntry {
    id: number;
    guruId: number | null;
    jumlahKg: string;
    createdAt: Date;
    guru: string | null;
    jenisSampahId: number | null;
    jenisSampah: string | null;
    hargaPerKg: string | null;
}

interface Props {
    kelas: Kelas[];
    jenisSampah: JenisSampah[];
    gurus: Guru[];
    initialSetoranGuru: SetoranGuruEntry[];
}

const MONTHS = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
];

// --- SUBMIT BUTTON COMPONENT ---
function SubmitButton({
    pendingText = 'Menyimpan...',
    children = 'Simpan',
}: {
    pendingText?: string;
    children?: React.ReactNode;
}) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? pendingText : children}
        </Button>
    );
}

// --- SETORAN GURU TAB COMPONENT ---
function TabSetoranGuru({
    jenisSampah,
    gurus: initialGurus,
    initialSetoranGuru,
}: {
    jenisSampah: JenisSampah[];
    gurus: Guru[];
    initialSetoranGuru: SetoranGuruEntry[];
}) {
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
    }, [addState]);

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

function GuruDialog({
    isOpen,
    onClose,
    guru,
    onSuccess,
}: {
    isOpen: boolean;
    onClose: () => void;
    guru: Guru | null;
    onSuccess: () => void;
}) {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [state, action] = useFormState(guru ? updateGuru.bind(null, guru.id) : createGuru, {
        message: null,
        errors: {},
        success: false,
    });

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast({ title: 'Sukses', description: state.message });
                onSuccess();
                onClose();
            } else {
                toast({
                    title: 'Gagal',
                    description: state.message,
                    variant: 'destructive',
                });
            }
        }
    }, [state]);

    useEffect(() => {
        if (!isOpen) {
            formRef.current?.reset();
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{guru ? 'Edit Guru' : 'Tambah Guru'}</DialogTitle>
                    <DialogDescription>
                        {guru ? 'Edit data guru.' : 'Tambah guru baru ke dalam sistem.'}
                    </DialogDescription>
                </DialogHeader>
                <form action={action} ref={formRef} className="space-y-4">
                    <div>
                        <Label htmlFor="namaGuru">Nama Guru</Label>
                        <Input
                            id="namaGuru"
                            name="namaGuru"
                            defaultValue={guru?.namaGuru || ''}
                            required
                        />
                        {state.errors?.namaGuru && (
                            <p className="text-sm text-destructive mt-1">
                                {state.errors.namaGuru[0]}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                        <SubmitButton>
                            {guru ? 'Simpan Perubahan' : 'Tambah Guru'}
                        </SubmitButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// --- SETORAN KELAS TAB COMPONENT (Existing Logic) ---
function TabSetoranKelas({
    kelas,
    jenisSampah,
}: {
    kelas: Kelas[];
    jenisSampah: JenisSampah[];
}) {
    const { toast } = useToast();

    const [localJenis, setLocalJenis] = useState<JenisSampah[]>(jenisSampah);
    const [editingJenis, setEditingJenis] = useState<JenisSampah | null>(null);
    const [jenisModalOpen, setJenisModalOpen] = useState(false);
    const [newJenisName, setNewJenisName] = useState('');
    const [newJenisPrice, setNewJenisPrice] = useState('');

    const [selectedMonth, setSelectedMonth] = useState<number>(
        new Date().getMonth() + 1,
    );
    const [selectedYear, setSelectedYear] = useState<number>(
        new Date().getFullYear(),
    );
    const [tableData, setTableData] = useState<any[]>([]);
    const [sumKg, setSumKg] = useState<number>(0);
    const [sumValue, setSumValue] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [tingkatFilter, setTingkatFilter] = useState<'all' | '7' | '8' | '9'>(
        'all',
    );

    const currentYear = new Date().getFullYear();
    const years = Array.from(
        { length: currentYear - 2020 + 6 },
        (_, i) => 2020 + i,
    );

    const buildEmptyRows = useMemo(
        () => () =>
            (kelas || [])
                .slice()
                .sort((a, b) =>
                    a.tingkat === b.tingkat
                        ? a.huruf.localeCompare(b.huruf)
                        : a.tingkat - b.tingkat,
                )
                .map((k) => ({
                    kelasId: k.id,
                    tingkat: k.tingkat,
                    huruf: k.huruf,
                    total: 0,
                    jenisList: null as string | null,
                })),
        [kelas],
    );

    const [manageOpen, setManageOpen] = useState(false);
    const [manageClass, setManageClass] = useState<Kelas | null>(null);
    const [entries, setEntries] = useState<SetoranEntry[]>([]);
    const [loadingEntries, setLoadingEntries] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<SetoranEntry | null>(
        null,
    );

    const [deleteJenisDialogOpen, setDeleteJenisDialogOpen] = useState(false);
    const [selectedJenis, setSelectedJenis] = useState<JenisSampah | null>(
        null,
    );

    const [resetDialogOpen, setResetDialogOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<any | null>(null);

    const [addJenisId, setAddJenisId] = useState<string>('');
    const [addJumlah, setAddJumlah] = useState<string>('');

    const [editingEntryId, setEditingEntryId] = useState<number | null>(null);
    const [editJenisId, setEditJenisId] = useState<string>('');
    const [editJumlah, setEditJumlah] = useState<string>('');

    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLocalJenis(jenisSampah);
    }, [jenisSampah]);

    const filteredRows = useMemo(() => {
        let rows = tableData as any[];
        if (tingkatFilter !== 'all') {
            rows = rows.filter((r) => String(r.tingkat) === tingkatFilter);
        }
        const q = searchQuery.trim().toLowerCase();
        if (q) {
            rows = rows.filter(
                (r) =>
                    `${r.tingkat}${r.huruf}`.toLowerCase().includes(q) ||
                    String(r.jenisList || '')
                        .toLowerCase()
                        .includes(q),
            );
        }
        return rows;
    }, [tableData, tingkatFilter, searchQuery]);

    const filteredSumKg = useMemo(
        () => filteredRows.reduce((s, r) => s + Number(r.total || 0), 0),
        [filteredRows],
    );
    const filteredSumValue = useMemo(
        () => filteredRows.reduce((s, r) => s + Number(r.totalValue || 0), 0),
        [filteredRows],
    );

    const handleCreateOrUpdateJenis = async (e: React.FormEvent) => {
        e.preventDefault();
        const name = newJenisName.trim();
        const price = parseFloat(newJenisPrice || '0');
        if (!name || !price) {
            toast({
                title: 'Error',
                description: 'Nama dan harga wajib diisi',
                variant: 'destructive',
            });
            return;
        }

        const res = editingJenis
            ? await updateJenisSampah(editingJenis.id, {
                  namaSampah: name,
                  hargaPerKg: price,
              })
            : await createJenisSampah({ namaSampah: name, hargaPerKg: price });

        if (res.success && res.data) {
            toast({
                title: 'Sukses',
                description: editingJenis
                    ? 'Jenis sampah diperbarui'
                    : 'Jenis sampah ditambahkan',
            });

            if (editingJenis) {
                setLocalJenis((prev) =>
                    prev.map((j) => (j.id === editingJenis.id ? res.data! : j)),
                );
            } else {
                setLocalJenis((prev) => [...prev, res.data!]);
            }

            setJenisModalOpen(false);
            setEditingJenis(null);
            setNewJenisName('');
            setNewJenisPrice('');
        } else {
            toast({
                title: 'Error',
                description: (res as any).error || 'Operasi gagal',
                variant: 'destructive',
            });
        }
    };

    const handleDeleteJenis = async (id: number) => {
        const res = await deleteJenisSampah(id);
        if (res.success) {
            toast({ title: 'Sukses', description: 'Jenis sampah dihapus' });
            setLocalJenis((prev) => prev.filter((j) => j.id !== id));
        } else {
            toast({
                title: 'Error',
                description: res.error || 'Gagal menghapus',
                variant: 'destructive',
            });
        }
    };

    const fetchRecap = async () => {
        const [totals, summary] = await Promise.all([
            getClassTotals(selectedMonth, selectedYear),
            getTotalsSummary(selectedMonth, selectedYear),
        ]);
        if (
            totals.data &&
            Array.isArray(totals.data) &&
            totals.data.length > 0
        ) {
            setTableData(totals.data);
        } else {
            setTableData(buildEmptyRows());
        }
        if (summary.data) {
            setSumKg(Number((summary.data as any).totalKg || 0));
            setSumValue(Number((summary.data as any).totalValue || 0));
        }
    };

    useEffect(() => {
        setTableData(buildEmptyRows());
        fetchRecap();
    }, []);

    useEffect(() => {
        fetchRecap();
    }, [selectedMonth, selectedYear]);

    const openManage = async (k: Kelas) => {
        setManageClass(k);
        setManageOpen(true);
        await fetchEntries(k.id);
    };

    const fetchEntries = async (kelasId: number) => {
        setLoadingEntries(true);
        const res = await getSampahKelasByKelasMonth(
            kelasId,
            selectedMonth,
            selectedYear,
        );
        if ((res as any).data) setEntries((res as any).data as SetoranEntry[]);
        setLoadingEntries(false);
    };

    const handleAddEntry = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!manageClass) return;
        const jenisId = parseInt(addJenisId || '0');
        const jumlah = parseFloat(addJumlah || '0');
        if (!jenisId || !jumlah) {
            toast({
                title: 'Error',
                description: 'Pilih jenis dan isi jumlah',
                variant: 'destructive',
            });
            return;
        }
        const res = await createSampahKelas({
            kelasId: manageClass.id,
            jenisSampahId: jenisId,
            jumlahKg: jumlah,
        });
        if ((res as any).success) {
            toast({ title: 'Sukses', description: 'Setoran ditambahkan' });
            setAddJenisId('');
            setAddJumlah('');
            await fetchEntries(manageClass.id);
            await fetchRecap();
        } else {
            toast({
                title: 'Error',
                description: (res as any).error || 'Gagal menambah setoran',
                variant: 'destructive',
            });
        }
    };

    const startEditEntry = (entry: SetoranEntry) => {
        setEditingEntryId(entry.id);
        setEditJenisId(String(entry.jenisSampahId));
        setEditJumlah(String(entry.jumlahKg));
    };

    const cancelEditEntry = () => {
        setEditingEntryId(null);
        setEditJenisId('');
        setEditJumlah('');
    };

    const handleSaveEntry = async (entryId: number) => {
        const jenisId = parseInt(editJenisId || '0');
        const jumlah = parseFloat(editJumlah || '0');
        if (!jenisId || !jumlah) {
            toast({
                title: 'Error',
                description: 'Pilih jenis dan isi jumlah',
                variant: 'destructive',
            });
            return;
        }
        const res = await updateSampahKelas(entryId, {
            jenisSampahId: jenisId,
            jumlahKg: jumlah,
        });
        if ((res as any).success) {
            toast({ title: 'Sukses', description: 'Setoran diperbarui' });
            cancelEditEntry();
            if (manageClass) {
                await fetchEntries(manageClass.id);
                await fetchRecap();
            }
        } else {
            toast({
                title: 'Error',
                description: (res as any).error || 'Gagal memperbarui setoran',
                variant: 'destructive',
            });
        }
    };

    const handleDeleteEntry = async (entryId: number) => {
        const res = await deleteSampahKelasRecord(entryId);
        if ((res as any).success) {
            toast({ title: 'Sukses', description: 'Setoran dihapus' });
            if (manageClass) {
                await fetchEntries(manageClass.id);
                await fetchRecap();
            }
        } else {
            toast({
                title: 'Error',
                description: (res as any).error || 'Gagal menghapus setoran',
                variant: 'destructive',
            });
        }
    };

    const handlePrintRecap = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2 print:break-inside-avoid">
                    <CardHeader className="flex items-center justify-end gap-2 sm:flex-row flex-col">
                        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto print:hidden">
                            <Select
                                value={selectedMonth.toString()}
                                onValueChange={(v) =>
                                    setSelectedMonth(parseInt(v))
                                }
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Pilih bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MONTHS.map((m, idx) => (
                                        <SelectItem
                                            key={m}
                                            value={(idx + 1).toString()}
                                        >
                                            {m}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={String(selectedYear)}
                                onValueChange={(v) =>
                                    setSelectedYear(parseInt(v))
                                }
                            >
                                <SelectTrigger className="w-28">
                                    <SelectValue placeholder="Pilih tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((y) => (
                                        <SelectItem key={y} value={String(y)}>
                                            {y}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={tingkatFilter}
                                onValueChange={(v) =>
                                    setTingkatFilter(v as any)
                                }
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Tingkat" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Kelas
                                    </SelectItem>
                                    <SelectItem value="7">Kelas 7</SelectItem>
                                    <SelectItem value="8">Kelas 8</SelectItem>
                                    <SelectItem value="9">Kelas 9</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                placeholder="Cari kelas/jenis..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-44"
                            />
                            <Button onClick={handlePrintRecap}>
                                <Printer className="h-4 w-4 mr-2" /> Cetak
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div ref={printRef} className="print:block">
                            <div className="hidden print:block text-center mb-4">
                                <h1 className="text-xl font-bold">
                                    Laporan Bank Sampah
                                </h1>
                            </div>
                            <div className="overflow-x-auto rounded border print:overflow-visible print:rounded-none print:border-0">
                                <Table className="min-w-full w-full print:min-w-0">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="whitespace-nowrap">
                                                No
                                            </TableHead>
                                            <TableHead className="whitespace-nowrap">
                                                Kelas
                                            </TableHead>
                                            <TableHead className="whitespace-nowrap">
                                                Jenis Sampah
                                            </TableHead>
                                            <TableHead className="whitespace-nowrap">
                                                Total (Kg)
                                            </TableHead>
                                            <TableHead className="whitespace-nowrap">
                                                Jumlah Harga (Rp)
                                            </TableHead>
                                            <TableHead className="whitespace-nowrap print:hidden">
                                                Aksi
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredRows.length === 0 && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={6}
                                                    className="text-center py-6"
                                                >
                                                    Tidak ada data sesuai
                                                    filter.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {filteredRows.map(
                                            (row: any, idx: number) => (
                                                <TableRow
                                                    key={`${row.kelasId}-${idx}`}
                                                >
                                                    <TableCell>
                                                        {idx + 1}
                                                    </TableCell>
                                                    <TableCell>{`${row.tingkat}${row.huruf}`}</TableCell>
                                                    <TableCell
                                                        className="max-w-[320px] truncate"
                                                        title={
                                                            row.jenisList || '-'
                                                        }
                                                    >
                                                        {row.jenisList || '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {Number(
                                                            row.total || 0,
                                                        ).toLocaleString(
                                                            'id-ID',
                                                            {
                                                                minimumFractionDigits: 0,
                                                                maximumFractionDigits: 2,
                                                            },
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        Rp{' '}
                                                        {Number(
                                                            row.totalValue || 0,
                                                        ).toLocaleString(
                                                            'id-ID',
                                                            {
                                                                minimumFractionDigits: 0,
                                                                maximumFractionDigits: 0,
                                                            },
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="print:hidden">
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="icon"
                                                                variant="outline"
                                                                title="Edit setoran"
                                                                onClick={() =>
                                                                    openManage({
                                                                        id: row.kelasId,
                                                                        tingkat:
                                                                            row.tingkat,
                                                                        huruf: row.huruf,
                                                                    })
                                                                }
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="destructive"
                                                                title="Reset bulan ini"
                                                                onClick={() => {
                                                                    setSelectedClass(
                                                                        row,
                                                                    );
                                                                    setResetDialogOpen(
                                                                        true,
                                                                    );
                                                                }}
                                                            >
                                                                <RotateCcw className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                        )}
                                    </TableBody>
                                    <tfoot>
                                        <TableRow>
                                            <TableCell
                                                colSpan={3}
                                                className="text-right font-semibold"
                                            >
                                                Total
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {filteredSumKg.toLocaleString(
                                                    'id-ID',
                                                    {
                                                        maximumFractionDigits: 2,
                                                    },
                                                )}
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                Rp{' '}
                                                {filteredSumValue.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </TableCell>
                                            <TableCell className="print:hidden"></TableCell>
                                        </TableRow>
                                    </tfoot>
                                </Table>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-1 print:hidden">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>Manajemen Jenis Sampah</CardTitle>
                        <div>
                            <Button onClick={() => setJenisModalOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" /> Jenis Baru
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {localJenis.map((j) => (
                                <div
                                    key={j.id}
                                    className="flex items-center justify-between border rounded p-3"
                                >
                                    <div>
                                        <div className="font-medium">
                                            {j.namaSampah}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Rp{' '}
                                            {Number(
                                                j.hargaPerKg,
                                            ).toLocaleString('id-ID')}
                                            /kg
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => {
                                                setEditingJenis(j);
                                                setNewJenisName(j.namaSampah);
                                                setNewJenisPrice(
                                                    String(j.hargaPerKg),
                                                );
                                                setJenisModalOpen(true);
                                            }}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            onClick={() => {
                                                setSelectedJenis(j);
                                                setDeleteJenisDialogOpen(true);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Jenis Sampah */}
            <Dialog
                open={jenisModalOpen}
                onOpenChange={(open) => {
                    setJenisModalOpen(open);
                    if (!open) {
                        setEditingJenis(null);
                        setNewJenisName('');
                        setNewJenisPrice('');
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingJenis
                                ? 'Edit Jenis Sampah'
                                : 'Tambah Jenis Sampah'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingJenis
                                ? 'Edit nama dan harga per kg.'
                                : 'Tambah jenis sampah baru.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={handleCreateOrUpdateJenis}
                        className="space-y-4"
                    >
                        <div>
                            <Label>Nama Jenis</Label>
                            <Input
                                value={newJenisName}
                                onChange={(e) =>
                                    setNewJenisName(e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <Label>Harga / Kg (Rp)</Label>
                            <Input
                                value={newJenisPrice}
                                onChange={(e) =>
                                    setNewJenisPrice(e.target.value)
                                }
                                type="number"
                                step="0.01"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="submit">Simpan</Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setJenisModalOpen(false)}
                            >
                                Batal
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Kelola Setoran per Kelas/Bulan */}
            <Dialog
                open={manageOpen}
                onOpenChange={(open) => {
                    setManageOpen(open);
                    if (!open) {
                        setManageClass(null);
                        setEntries([]);
                        setAddJenisId('');
                        setAddJumlah('');
                        cancelEditEntry();
                    }
                }}
            >
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>
                            Kelola Setoran{' '}
                            {manageClass
                                ? `${manageClass.tingkat}${manageClass.huruf}`
                                : ''}{' '}
                            — {MONTHS[selectedMonth - 1]} {selectedYear}
                        </DialogTitle>
                        <DialogDescription>
                            Tambah atau edit setoran untuk kelas ini pada bulan yang dipilih.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Add form */}
                    <form
                        onSubmit={handleAddEntry}
                        className="grid grid-cols-1 sm:grid-cols-5 gap-2"
                    >
                        <div className="sm:col-span-2">
                            <Label>Jenis Sampah</Label>
                            <Select
                                value={addJenisId}
                                onValueChange={setAddJenisId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih jenis" />
                                </SelectTrigger>
                                <SelectContent>
                                    {localJenis.map((j) => (
                                        <SelectItem
                                            value={String(j.id)}
                                            key={j.id}
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
                                value={addJumlah}
                                onChange={(e) => setAddJumlah(e.target.value)}
                                type="number"
                                step="0.01"
                            />
                        </div>
                        <div className="sm:col-span-1 flex items-end">
                            <Button type="submit" className="w-full">
                                <Plus className="h-4 w-4 mr-1" /> Tambah
                            </Button>
                        </div>
                    </form>

                    {/* Entries table */}
                    <div className="overflow-x-auto rounded border mt-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Jenis</TableHead>
                                    <TableHead>Jumlah (Kg)</TableHead>
                                    <TableHead>Harga/Kg</TableHead>
                                    <TableHead>Total (Rp)</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead className="w-[120px]">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loadingEntries && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center py-6"
                                        >
                                            Memuat...
                                        </TableCell>
                                    </TableRow>
                                )}
                                {!loadingEntries && entries.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center py-6"
                                        >
                                            Belum ada setoran
                                        </TableCell>
                                    </TableRow>
                                )}
                                {entries.map((e) => {
                                    const isEditing = editingEntryId === e.id;
                                    const harga = Number(e.hargaPerKg || 0);
                                    const jumlah = Number(e.jumlahKg || 0);
                                    return (
                                        <TableRow key={e.id}>
                                            <TableCell>
                                                {isEditing ? (
                                                    <Select
                                                        value={editJenisId}
                                                        onValueChange={
                                                            setEditJenisId
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {localJenis.map(
                                                                (j) => (
                                                                    <SelectItem
                                                                        value={String(
                                                                            j.id,
                                                                        )}
                                                                        key={
                                                                            j.id
                                                                        }
                                                                    >
                                                                        {
                                                                            j.namaSampah
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    e.jenisSampah
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {isEditing ? (
                                                    <Input
                                                        value={editJumlah}
                                                        onChange={(ev) =>
                                                            setEditJumlah(
                                                                ev.target.value,
                                                            )
                                                        }
                                                        type="number"
                                                        step="0.01"
                                                    />
                                                ) : (
                                                    jumlah.toLocaleString(
                                                        'id-ID',
                                                    )
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                Rp{' '}
                                                {harga.toLocaleString('id-ID')}
                                            </TableCell>
                                            <TableCell>
                                                Rp{' '}
                                                {(
                                                    harga * jumlah
                                                ).toLocaleString('id-ID')}
                                            </TableCell>
                                            <TableCell>
                                                {e.createdAt
                                                    ? new Date(
                                                          e.createdAt,
                                                      ).toLocaleDateString(
                                                          'id-ID',
                                                      )
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    {isEditing ? (
                                                        <>
                                                            <Button
                                                                size="icon"
                                                                onClick={() =>
                                                                    handleSaveEntry(
                                                                        e.id,
                                                                    )
                                                                }
                                                            >
                                                                <Save className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="outline"
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
                                                                onClick={() =>
                                                                    startEditEntry(
                                                                        e,
                                                                    )
                                                                }
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="destructive"
                                                                onClick={() => {
                                                                    setSelectedEntry(
                                                                        e,
                                                                    );
                                                                    setDeleteDialogOpen(
                                                                        true,
                                                                    );
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Confirm delete setoran */}
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    setDeleteDialogOpen(open);
                    if (!open) setSelectedEntry(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus setoran?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedEntry
                                ? `Jenis: ${selectedEntry.jenisSampah} — Jumlah: ${selectedEntry.jumlahKg} kg. Tindakan ini tidak dapat dibatalkan.`
                                : 'Tindakan ini tidak dapat dibatalkan.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                if (!selectedEntry) return;
                                await handleDeleteEntry(selectedEntry.id);
                                setDeleteDialogOpen(false);
                                setSelectedEntry(null);
                            }}
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Confirm delete jenis sampah */}
            <AlertDialog
                open={deleteJenisDialogOpen}
                onOpenChange={(open) => {
                    setDeleteJenisDialogOpen(open);
                    if (!open) setSelectedJenis(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus jenis sampah?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedJenis
                                ? `Jenis: ${selectedJenis.namaSampah}. Tindakan ini tidak dapat dibatalkan.`
                                : 'Tindakan ini tidak dapat dibatalkan.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                if (!selectedJenis) return;
                                await handleDeleteJenis(selectedJenis.id);
                                setDeleteJenisDialogOpen(false);
                                setSelectedJenis(null);
                            }}
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Confirm reset setoran */}
            <AlertDialog
                open={resetDialogOpen}
                onOpenChange={(open) => {
                    setResetDialogOpen(open);
                    if (!open) setSelectedClass(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reset Setoran?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedClass
                                ? `Reset semua setoran kelas ${
                                      selectedClass.tingkat
                                  }${selectedClass.huruf} untuk ${
                                      MONTHS[selectedMonth - 1]
                                  } ${selectedYear}?`
                                : 'Tindakan ini tidak dapat dibatalkan.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                if (!selectedClass) return;
                                const res = await resetClassDepositsByMonth(
                                    selectedClass.kelasId,
                                    selectedMonth,
                                    selectedYear,
                                );
                                if ((res as any).success) {
                                    toast({
                                        title: 'Sukses',
                                        description:
                                            'Setoran bulan ini direset',
                                    });
                                    fetchRecap();
                                } else {
                                    toast({
                                        title: 'Error',
                                        description:
                                            (res as any).error || 'Gagal reset',
                                        variant: 'destructive',
                                    });
                                }
                                setResetDialogOpen(false);
                                setSelectedClass(null);
                            }}
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

// --- MAIN WRAPPER COMPONENT ---
export default function SispendikClient(props: Props) {
    return (
        <Tabs defaultValue="kelas" className="w-full">
            <TabsList className="grid w-full grid-cols-2 print:hidden">
                <TabsTrigger
                    value="kelas"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                    Setoran per Kelas
                </TabsTrigger>
                <TabsTrigger
                    value="guru"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                    Setoran Guru
                </TabsTrigger>
            </TabsList>
            <TabsContent value="kelas">
                <TabSetoranKelas
                    kelas={props.kelas}
                    jenisSampah={props.jenisSampah}
                />
            </TabsContent>
            <TabsContent value="guru">
                <TabSetoranGuru
                    jenisSampah={props.jenisSampah}
                    gurus={props.gurus}
                    initialSetoranGuru={props.initialSetoranGuru}
                />
            </TabsContent>
        </Tabs>
    );
}
