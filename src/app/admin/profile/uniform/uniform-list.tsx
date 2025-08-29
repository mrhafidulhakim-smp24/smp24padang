'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Pencil, PlusCircle } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import Image from 'next/image';
import { updateUniform, createUniform, deleteUniform } from './actions';
import { useToast } from '@/hooks/use-toast';
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

import { Uniform } from './types';

type UniformListProps = {
    initialUniformsData: Uniform[];
};

export default function UniformList({ initialUniformsData }: UniformListProps) {
    const { toast } = useToast();
    const [uniformsData, setUniformsData] =
        useState<Uniform[]>(initialUniformsData);
    const [isAddOpen, setAddOpen] = useState(false);
    const [isEditOpen, setEditOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [selectedUniform, setSelectedUniform] = useState<Uniform | null>(
        null,
    );
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        setUniformsData(initialUniformsData);
    }, [initialUniformsData]);

    const refreshUniforms = async () => {};

    const handleAdd = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        const result = await createUniform(formData);

        if (result.success) {
            toast({
                title: 'Success',
                description: result.message,
            });
            setAddOpen(false);
            setImageFile(null);
        } else {
            toast({
                title: 'Error',
                description: result.message,
                variant: 'destructive',
            });
        }
    };

    const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedUniform) return;

        const formData = new FormData(event.currentTarget);
        formData.append('id', selectedUniform.id.toString());
        if (imageFile) {
            formData.append('image', imageFile);
        }

        const result = await updateUniform(selectedUniform.id, formData);

        if (result.success) {
            toast({
                title: 'Success',
                description: result.message,
            });
            setEditOpen(false);
            setSelectedUniform(null);
            setImageFile(null);
        } else {
            toast({
                title: 'Error',
                description: result.message,
                variant: 'destructive',
            });
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedUniform) return;

        const result = await deleteUniform(selectedUniform.id);

        if (result.success) {
            toast({
                title: 'Success',
                description: result.message,
            });
            setDeleteOpen(false);
            setSelectedUniform(null);
        } else {
            toast({
                title: 'Error',
                description: result.message,
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                        Kelola Seragam Sekolah
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Perbarui gambar dan deskripsi untuk setiap seragam.
                    </p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah Seragam
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah Seragam Baru</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <Label htmlFor="type-add">Jenis Seragam</Label>
                                <Select name="type" defaultValue="daily">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih jenis seragam" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">
                                            Harian
                                        </SelectItem>
                                        <SelectItem value="sport">
                                            Olah Raga
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="day-add">
                                    Hari (Opsional untuk Olah Raga)
                                </Label>
                                <Input
                                    id="day-add"
                                    name="day"
                                    placeholder="Contoh: Senin"
                                />
                            </div>
                            <div>
                                <Label htmlFor="description-add">
                                    Deskripsi
                                </Label>
                                <Input
                                    id="description-add"
                                    name="description"
                                    required
                                />
                            </div>
                            <div>
                                <Label>Gambar</Label>
                                <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <Label
                                            htmlFor="file-upload-add"
                                            className="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none hover:text-primary/80"
                                        >
                                            <span>Unggah file</span>
                                            <Input
                                                id="file-upload-add"
                                                type="file"
                                                className="sr-only"
                                                onChange={(e) =>
                                                    setImageFile(
                                                        e.target.files
                                                            ? e.target.files[0]
                                                            : null,
                                                    )
                                                }
                                            />
                                        </Label>
                                        {imageFile && (
                                            <p className="text-sm text-gray-500">
                                                Selected: {imageFile.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Simpan</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {uniformsData.map((uniform) => (
                    <Card
                        key={uniform.id}
                        className="group relative overflow-hidden"
                    >
                        <CardHeader className="p-0">
                            {uniform.image ? (
                                <Image
                                    src={uniform.image}
                                    alt={uniform.day || uniform.type}
                                    width={400}
                                    height={600}
                                    className="aspect-[4/6] w-full object-cover"
                                />
                            ) : (
                                <div className="flex aspect-[4/6] w-full items-center justify-center bg-gray-200 text-gray-500">
                                    No Image
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="p-4">
                            <CardTitle className="font-headline text-xl text-primary">
                                {uniform.type === 'daily'
                                    ? uniform.day
                                    : 'Seragam Olah Raga'}
                            </CardTitle>
                            <CardDescription>
                                {uniform.description}
                            </CardDescription>
                        </CardContent>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSelectedUniform(uniform);
                                    setEditOpen(true);
                                }}
                            >
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="ml-2"
                                onClick={() => {
                                    setSelectedUniform(uniform);
                                    setDeleteOpen(true);
                                }}
                            >
                                Hapus
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <Dialog open={isEditOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Edit Seragam:{' '}
                            {selectedUniform?.day || selectedUniform?.type}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4">
                        <div>
                            <Label htmlFor="type-edit">Jenis Seragam</Label>
                            <Select
                                name="type"
                                defaultValue={selectedUniform?.type}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih jenis seragam" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">
                                        Harian
                                    </SelectItem>
                                    <SelectItem value="sport">
                                        Olah Raga
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="day-edit">
                                Hari (Opsional untuk Olah Raga)
                            </Label>
                            <Input
                                id="day-edit"
                                name="day"
                                defaultValue={selectedUniform?.day || ''}
                                placeholder="Contoh: Senin"
                            />
                        </div>
                        <div>
                            <Label htmlFor="description-edit">Deskripsi</Label>
                            <Input
                                id="description-edit"
                                name="description"
                                defaultValue={selectedUniform?.description}
                                required
                            />
                        </div>
                        <div>
                            <Label>Ganti Gambar</Label>
                            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <Label
                                        htmlFor="file-upload-edit"
                                        className="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none hover:text-primary/80"
                                    >
                                        <span>Unggah file baru</span>
                                        <Input
                                            id="file-upload-edit"
                                            name="image"
                                            type="file"
                                            className="sr-only"
                                            onChange={(e) =>
                                                setImageFile(
                                                    e.target.files
                                                        ? e.target.files[0]
                                                        : null,
                                                )
                                            }
                                        />
                                    </Label>
                                    {imageFile && (
                                        <p className="text-sm text-gray-500">
                                            Selected: {imageFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit">Simpan Perubahan</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setSelectedUniform(null)}
                        >
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
