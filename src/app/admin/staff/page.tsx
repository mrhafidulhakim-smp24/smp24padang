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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
                <Input
                    id="position"
                    name="position"
                    defaultValue={initialData?.position}
                    required
                />
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

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                        Kelola Guru & Staf
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Tambah, edit, atau hapus data guru dan staf sekolah.
                    </p>
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

            <Card>
                <CardContent className="p-4">
                    {staff.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {staff.map((item) => (
                                <Card key={item.id} className="flex flex-col items-center text-center group">
                                    <CardHeader className="p-0">
                                        <div className="relative aspect-square w-full max-w-[150px] overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl mt-4">
                                            <Image
                                                src={item.imageUrl || "https://placehold.co/150x150.png"}
                                                alt={item.name}
                                                width={150}
                                                height={150}
                                                className="object-cover"
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center p-4">
                                        <h3 className="mt-2 text-lg font-bold text-primary">{item.name}</h3>
                                        <p className="font-semibold text-sm text-accent">{item.position}</p>
                                        <p className="text-xs text-muted-foreground">{item.subject}</p>
                                        {item.homeroomOf && (
                                            <Badge variant="secondary" className="mt-2">
                                                Wali Kelas {item.homeroomOf}
                                            </Badge>
                                        )}
                                        <div className="mt-4 flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedStaff(item);
                                                    setEditOpen(true);
                                                }}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedStaff(item);
                                                    setDeleteOpen(true);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">Belum ada data staf.</p>
                    )}
                </CardContent>
            </Card>

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
                            Tindakan ini tidak dapat dibatalkan. Ini akan
                            menghapus data staf secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setSelectedStaff(null)}
                        >
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
        </div>
    );
}