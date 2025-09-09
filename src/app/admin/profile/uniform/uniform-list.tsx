'use client';

import { useState, useEffect, useTransition } from 'react';
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
import { Upload, Pencil } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import Image from 'next/image';
import { updateUniform, createUniform } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Uniform } from './types';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Olahraga'];

type UniformListProps = {
    initialUniformsData: Uniform[];
};

export default function UniformList({ initialUniformsData = [] }: UniformListProps) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [uniforms, setUniforms] = useState<Uniform[]>(initialUniformsData);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedUniform, setSelectedUniform] = useState<Uniform | null>(
        null,
    );
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        setUniforms(initialUniformsData);
    }, [initialUniformsData]);

    const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedUniform) return;

        const formData = new FormData();
        formData.append('description', selectedUniform.description || ''); // Use selectedUniform.description
        if (imageFile) {
            formData.append('image', imageFile);
        }
        formData.append('uniformId', String(selectedUniform.id));
        formData.append('uniformDay', selectedUniform.day || '');
        formData.append('uniformType', selectedUniform.type);

        const isCreating = String(selectedUniform.id).startsWith('new-');

        startTransition(async () => {
            let result;
            if (isCreating) {
                result = await createUniform(
                    formData,
                );
            } else {
                result = await updateUniform(
                    formData,
                );
            }

            if (result.success) {
                toast({
                    title: 'Sukses!',
                    description: isCreating ? 'Seragam berhasil ditambahkan.' : 'Seragam berhasil diperbarui.',
                });

                // Re-fetch uniforms to get the latest data including new/updated items
                // This is a simpler approach than manually updating the state for both create/update
                // For now, we'll rely on the revalidatePath in the action.
                // The page will re-render with fresh data.
                setIsEditDialogOpen(false);
                setSelectedUniform(null);
                setImageFile(null); // Clear the selected image file
            } else {
                toast({
                    title: 'Gagal!',
                    description: result.message,
                    variant: 'destructive',
                });
            }
        });
    };

    const openEditDialog = (day: string) => {
        const uniformForDay =
            uniforms.find((u) => u.day === day) ||
            (day === 'Olahraga' && uniforms.find((u) => u.type === 'sport'));

        if (uniformForDay) {
            setSelectedUniform(uniformForDay);
        } else {
            // Prepare a new uniform object for creation
            const newUniform: Uniform = {
                id: `new-${day}`, // Temporary ID for new uniforms
                day: day === 'Olahraga' ? null : day,
                type: day === 'Olahraga' ? 'sport' : 'daily',
                description: '',
                image: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setSelectedUniform(newUniform);
        }
        setIsEditDialogOpen(true); // Always open the dialog
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    Kelola Seragam Sekolah
                </CardTitle>
                <CardDescription className="mt-2 text-lg">
                    Perbarui gambar dan deskripsi untuk setiap seragam.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {DAYS.map((day) => {
                        const uniform =
                            uniforms.find((u) => u.day === day) ||
                            (day === 'Olahraga'
                                ? uniforms.find((u) => u.type === 'sport')
                                : undefined);

                        return (
                            <Card
                                key={day}
                                className="group relative overflow-hidden"
                            >
                                <CardHeader className="p-0">
                                    <Image
                                        src={
                                            uniform?.image ||
                                            'https://placehold.co/400x600.png'
                                        }
                                        alt={uniform?.description || day}
                                        width={400}
                                        height={600}
                                        className="aspect-[4/6] w-full object-cover"
                                    />
                                </CardHeader>
                                <CardContent className="p-4">
                                    <CardTitle className="font-headline text-xl text-primary">
                                        {day}
                                    </CardTitle>
                                    <CardDescription>
                                        {(uniform && uniform.description) ||
                                            'Belum ada deskripsi'}
                                    </CardDescription>
                                </CardContent>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openEditDialog(day)}
                                    >
                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </CardContent>
            <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
                setIsEditDialogOpen(open);
                if (!open) {
                    setImageFile(null); // Clear selected image when dialog closes
                    setSelectedUniform(null); // Clear selected uniform
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Edit Seragam{' '}
                            {selectedUniform?.day ||
                                (selectedUniform?.type === 'sport' &&
                                    'Olahraga')}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="description-edit">Deskripsi</Label>
                            <Input
                                id="description-edit"
                                name="description"
                                defaultValue={
                                    selectedUniform?.description || ''
                                }
                                required
                            />
                        </div>
                        <div>
                            <Label>Gambar Saat Ini</Label>
                            <div className="mt-2 mb-4">
                                {selectedUniform?.image && !imageFile ? (
                                    <Image
                                        src={selectedUniform.image}
                                        alt="Current Uniform Image"
                                        width={200}
                                        height={300}
                                        className="object-cover rounded-md"
                                    />
                                ) : imageFile ? (
                                    <Image
                                        src={URL.createObjectURL(imageFile)}
                                        alt="New Uniform Image Preview"
                                        width={200}
                                        height={300}
                                        className="object-cover rounded-md"
                                    />
                                ) : (
                                    <p className="text-sm text-muted-foreground">Tidak ada gambar saat ini.</p>
                                )}
                            </div>
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
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending
                                    ? 'Menyimpan...'
                                    : 'Simpan Perubahan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
}