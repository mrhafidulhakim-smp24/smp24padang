'use client';

import { useState, useEffect, useTransition } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Image from 'next/image';
import {
    MoreHorizontal,
    Pencil,
    PlusCircle,
    Trash2,
    Upload,
} from 'lucide-react';
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createStaff, updateStaff, deleteStaff, getStaff } from './actions';
import type { staff as StaffSchema } from '@/lib/db/schema';
import { type InferSelectModel } from 'drizzle-orm';
import { Badge } from '@/components/ui/badge';

type Staff = InferSelectModel<typeof StaffSchema>;

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Menyimpan...' : 'Simpan'}
        </Button>
    );
}

function StaffForm({
    action,
    initialData,
    onClose,
}: {
    action: (
        state: { success: boolean; message: string },
        formData: FormData,
    ) => Promise<{ success: boolean; message: string }>;
    initialData?: Staff | null;
    onClose: () => void;
}) {
    const [state, formAction] = useFormState(action, {
        success: false,
        message: '',
    });
    const { toast } = useToast();
    const [preview, setPreview] = useState(initialData?.imageUrl || null);

    useEffect(() => {
        if (state.success) {
            toast({
                title: 'Sukses!',
                description: state.message || 'Aksi berhasil diselesaikan.',
            });
            onClose();
        } else if (state.message) {
            toast({
                title: 'Gagal',
                description: state.message,
                variant: 'destructive',
            });
        }
    }, [state, toast, onClose]);

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

    return (
        <form action={formAction} className="space-y-4">
            <div>
                <Label>Foto</Label>
                <div className="mt-1 flex items-center gap-4">
                    {preview ? (
                        <Image
                            src={preview}
                            alt="Preview"
                            width={80}
                            height={80}
                            className="rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                            <Upload className="h-8 w-8 text-muted-foreground" />
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
            <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                    id="name"
                    name="name"
                    defaultValue={initialData?.name}
                    required
                />
            </div>
            <div>
                <Label htmlFor="position">Jabatan</Label>
                <Select name="position" defaultValue={initialData?.position} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih jabatan..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Kepala Sekolah">Kepala Sekolah</SelectItem>
                        <SelectItem value="Wakil Kurikulum">Wakil Kurikulum</SelectItem>
                        <SelectItem value="Wakil Kesiswaan">Wakil Kesiswaan</SelectItem>
                        <SelectItem value="Koordinator Tata Usaha">Koordinator Tata Usaha</SelectItem>
                        <SelectItem value="Wakil Sarana & Prasarana">Wakil Sarana & Prasarana</SelectItem>
                        <SelectItem value="Guru Mata Pelajaran">Guru Mata Pelajaran</SelectItem>
                        <SelectItem value="Guru Bimbingan Konseling">Guru Bimbingan Konseling</SelectItem>
                        <SelectItem value="Staf Tata Usaha">Staf Tata Usaha</SelectItem>
                        <SelectItem value="Pustakawan">Pustakawan</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="subject">Mata Pelajaran / Bidang</Label>
                <Input
                    id="subject"
                    name="subject"
                    defaultValue={initialData?.subject || ''}
                />
            </div>
            <div>
                <Label htmlFor="homeroomOf">Wali Kelas (Opsional)</Label>
                <Input
                    id="homeroomOf"
                    name="homeroomOf"
                    placeholder="Contoh: Kelas 9A"
                    defaultValue={initialData?.homeroomOf || ''}
                />
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                    Batal
                </Button>
                <SubmitButton />
            </DialogFooter>
        </form>
    );
}

export default function StaffAdminPage() {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [search, setSearch] = useState('');
    const [positionFilter, setPositionFilter] = useState('');
    const [isAddOpen, setAddOpen] = useState(false);
    const [isEditOpen, setEditOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        getStaff().then(setStaff);
    }, []);

    const { toast } = useToast();

    const handleDelete = () => {
        if (!selectedStaff) return;
        startTransition(async () => {
            const result = await deleteStaff(
                selectedStaff.id,
                selectedStaff.imageUrl,
            );
            if (result.success) {
                toast({ title: 'Sukses!', description: result.message });
                setStaff(staff.filter((a) => a.id !== selectedStaff.id));
                setDeleteOpen(false);
                setSelectedStaff(null);
            } else {
                toast({
                    title: 'Gagal',
                    description: result.message,
                    variant: 'destructive',
                });
            }
        });
    };

    const boundUpdateStaff = updateStaff.bind(
        null,
        selectedStaff?.id || '',
        selectedStaff?.imageUrl || null,
    );

    const positions = [...new Set(staff.map((s) => s.position).filter(Boolean))];

    const filteredStaff = staff.filter(s => {
        const nameMatch = (s.name || '').toLowerCase().includes(search.toLowerCase());
        const positionMatch = positionFilter ? s.position === positionFilter : true;
        return nameMatch && positionMatch;
    });

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">Kelola Guru & Staf</CardTitle>
                        <CardDescription className="mt-2 text-lg">
                            Tambah, edit, atau hapus data guru dan staf sekolah.
                        </CardDescription>
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Tambah Staf
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tambah Staf Baru</DialogTitle>
                            </DialogHeader>
                            <StaffForm
                                action={createStaff}
                                onClose={() => {
                                    setAddOpen(false);
                                    getStaff().then(setStaff);
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="mt-4 flex items-center gap-4">
    <Input 
        placeholder="Cari nama..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
    />
    <Select value={positionFilter} onValueChange={setPositionFilter}>
        <SelectTrigger className="max-w-sm">
            <SelectValue placeholder="Filter berdasarkan jabatan" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="">Semua Jabatan</SelectItem>
            {positions.map(position => (
                <SelectItem key={position} value={position}>{position}</SelectItem>
            ))}
        </SelectContent>
    </Select>
</div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Foto</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Jabatan</TableHead>
                            <TableHead>Bidang Studi</TableHead>
                            <TableHead>Wali Kelas</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStaff.length > 0 ? (
                            filteredStaff.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Image
                                            src={item.imageUrl || "https://placehold.co/64x64.png"}
                                            alt={item.name || ''}
                                            width={64}
                                            height={64}
                                            className="rounded-md object-cover"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.position}</TableCell>
                                    <TableCell>{item.subject || '-'}</TableCell>
                                    <TableCell>
                                        {item.homeroomOf ? (
                                            <Badge variant="secondary">Wali Kelas {item.homeroomOf}</Badge>
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Buka menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedStaff(item);
                                                        setEditOpen(true);
                                                    }}
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-500"
                                                    onClick={() => {
                                                        setSelectedStaff(item);
                                                        setDeleteOpen(true);
                                                    }}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Belum ada data staf.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            {/* Edit and Delete Dialogs */}
            <Dialog open={isEditOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Data Staf</DialogTitle>
                    </DialogHeader>
                    {selectedStaff && (
                        <StaffForm
                            action={boundUpdateStaff}
                            initialData={selectedStaff}
                            onClose={() => {
                                setEditOpen(false);
                                setSelectedStaff(null);
                                getStaff().then(setStaff);
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
            <AlertDialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data staf secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedStaff(null)}>
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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