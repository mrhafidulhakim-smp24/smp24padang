'use client';

import { useState, useEffect, useTransition } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { MoreHorizontal, Pencil, PlusCircle, Trash2 } from 'lucide-react';
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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    getAnnouncementsForAdmin,
} from './actions';
import { type Announcement } from './schema';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Menyimpan...' : 'Simpan'}
        </Button>
    );
}

function AnnouncementForm({
    action,
    initialData,
    onClose,
}: {
    action: (
        state: { success: boolean; message: string },
        formData: FormData,
    ) => Promise<{ success: boolean; message: string }>;
    initialData?: Announcement | null;
    onClose: () => void;
}) {
    const [state, formAction] = useFormState(action, {
        success: false,
        message: '',
    });
    const { toast } = useToast();

    useEffect(() => {
        if (state.success) {
            toast({ title: 'Sukses!', description: state.message });
            onClose();
        } else if (state.message) {
            toast({
                title: 'Gagal',
                description: state.message,
                variant: 'destructive',
            });
        }
    }, [state, toast, onClose]);

    return (
        <form action={formAction} className="space-y-4">
            <div>
                <Label htmlFor="title">Judul Pengumuman</Label>
                <Input
                    id="title"
                    name="title"
                    defaultValue={initialData?.title}
                    required
                />
            </div>
            <div>
                <Label htmlFor="date">Tanggal</Label>
                <Input
                    id="date"
                    name="date"
                    type="date"
                    defaultValue={
                        initialData?.date
                            ? new Date(initialData.date)
                                  .toISOString()
                                  .split('T')[0]
                            : ''
                    }
                    required
                />
            </div>
            <div>
                <Label htmlFor="description">Isi Pengumuman</Label>
                <Textarea
                    id="description"
                    name="description"
                    defaultValue={initialData?.description}
                    required
                    rows={10}
                />
            </div>
            <div>
                <Label htmlFor="pdfUrl">URL PDF Google Drive</Label>
                <Input
                    id="pdfUrl"
                    name="pdfUrl"
                    defaultValue={initialData?.pdfUrl || ''}
                    placeholder="https://docs.google.com/document/d/your-id/edit?usp=sharing"
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

export default function AnnouncementsAdminPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isAddOpen, setAddOpen] = useState(false);
    const [isEditOpen, setEditOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] =
        useState<Announcement | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        getAnnouncementsForAdmin().then((data) =>
            setAnnouncements(data as Announcement[]),
        );
    }, []);

    const { toast } = useToast();

    const handleFetchAndUpdate = () => {
        getAnnouncementsForAdmin().then((data) =>
            setAnnouncements(data as Announcement[]),
        );
    };

    const handleDelete = () => {
        if (!selectedAnnouncement) return;
        startTransition(async () => {
            const result = await deleteAnnouncement(selectedAnnouncement.id);
            if (result.success) {
                toast({ title: 'Sukses!', description: result.message });
                setAnnouncements(
                    announcements.filter(
                        (a) => a.id !== selectedAnnouncement.id,
                    ),
                );
                setDeleteOpen(false);
                setSelectedAnnouncement(null);
            } else {
                toast({
                    title: 'Gagal',
                    description: result.message,
                    variant: 'destructive',
                });
            }
        });
    };

    const boundUpdateAnnouncement = updateAnnouncement.bind(
        null,
        selectedAnnouncement?.id || '',
    );

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">
                            Kelola Pengumuman
                        </CardTitle>
                        <CardDescription className="mt-2 text-lg">
                            Tambah, edit, atau hapus pengumuman.
                        </CardDescription>
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Tambah Pengumuman
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>
                                    Tambah Pengumuman Baru
                                </DialogTitle>
                            </DialogHeader>
                            <AnnouncementForm
                                action={createAnnouncement}
                                onClose={() => {
                                    setAddOpen(false);
                                    handleFetchAndUpdate();
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Judul</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead className="text-right">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {announcements.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium text-base">
                                        {item.title}
                                    </TableCell>
                                    <TableCell className="text-base">
                                        {new Date(item.date).toLocaleDateString(
                                            'id-ID',
                                            {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            },
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onSelect={() => {
                                                        setSelectedAnnouncement(
                                                            item,
                                                        );
                                                        setEditOpen(true);
                                                    }}
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    <span>Edit</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onSelect={() => {
                                                        setSelectedAnnouncement(
                                                            item,
                                                        );
                                                        setDeleteOpen(true);
                                                    }}
                                                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    <span>Hapus</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
            {/* Edit and Delete Dialogs */}
            <Dialog open={isEditOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Pengumuman</DialogTitle>
                    </DialogHeader>
                    {selectedAnnouncement && (
                        <AnnouncementForm
                            action={boundUpdateAnnouncement}
                            initialData={selectedAnnouncement}
                            onClose={() => {
                                setEditOpen(false);
                                setSelectedAnnouncement(null);
                                handleFetchAndUpdate();
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
                            menghapus pengumuman secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setSelectedAnnouncement(null)}
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
        </Card>
    );
}
