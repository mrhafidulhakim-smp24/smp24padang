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
import { createFaq, updateFaq, deleteFaq, getFaqs } from './actions';
import { type Faq } from './schema';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Menyimpan...' : 'Simpan'}
        </Button>
    );
}

function FaqForm({
    action,
    initialData,
    onClose,
}: {
    action: (
        state: { success: boolean; message: string },
        formData: FormData,
    ) => Promise<{ success: boolean; message: string }>;
    initialData?: Faq | null;
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
                <Label htmlFor="question">Pertanyaan</Label>
                <Input
                    id="question"
                    name="question"
                    defaultValue={initialData?.question}
                    required
                />
            </div>
            <div>
                <Label htmlFor="answer">Jawaban</Label>
                <Textarea
                    id="answer"
                    name="answer"
                    defaultValue={initialData?.answer}
                    required
                    rows={5}
                />
            </div>
            <DialogFooter className="flex-row justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                    Batal
                </Button>
                <SubmitButton />
            </DialogFooter>
        </form>
    );
}

export default function FaqAdminPage() {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [isAddOpen, setAddOpen] = useState(false);
    const [isEditOpen, setEditOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        getFaqs().then((data) => setFaqs(data as Faq[]));
    }, []);

    const { toast } = useToast();

    const handleDelete = () => {
        if (!selectedFaq) return;
        startTransition(async () => {
            const result = await deleteFaq(selectedFaq.id);
            if (result.success) {
                toast({ title: 'Sukses!', description: result.message });
                setFaqs(faqs.filter((f) => f.id !== selectedFaq.id));
                setDeleteOpen(false);
                setSelectedFaq(null);
            } else {
                toast({
                    title: 'Gagal',
                    description: result.message,
                    variant: 'destructive',
                });
            }
        });
    };

    const boundUpdateFaq = updateFaq.bind(null, selectedFaq?.id || '');

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">
                            Kelola FAQ
                        </CardTitle>
                        <CardDescription className="mt-2 text-lg">
                            Tambah, edit, atau hapus pertanyaan yang sering
                            diajukan.
                        </CardDescription>
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Tambah FAQ
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Tambah FAQ Baru</DialogTitle>
                            </DialogHeader>
                            <FaqForm
                                action={createFaq}
                                onClose={() => {
                                    setAddOpen(false);
                                    getFaqs().then((data) =>
                                        setFaqs(data as Faq[]),
                                    );
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
                                <TableHead>Pertanyaan</TableHead>
                                <TableHead>Jawaban</TableHead>
                                <TableHead className="text-right">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {faqs.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium text-base">
                                        {item.question}
                                    </TableCell>
                                    <TableCell className="text-base">
                                        {item.answer}
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
                                                        setSelectedFaq(item);
                                                        setEditOpen(true);
                                                    }}
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    <span>Edit</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onSelect={() => {
                                                        setSelectedFaq(item);
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
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit FAQ</DialogTitle>
                    </DialogHeader>
                    {selectedFaq && (
                        <FaqForm
                            action={boundUpdateFaq}
                            initialData={selectedFaq}
                            onClose={() => {
                                setEditOpen(false);
                                setSelectedFaq(null);
                                getFaqs().then((data) =>
                                    setFaqs(data as Faq[]),
                                );
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
                            menghapus data FAQ secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedFaq(null)}>
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
