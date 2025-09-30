'use client';

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import {
    updateUniform,
    createUniform,
} from '@/app/admin/profile/uniform/actions';
import { useToast } from '@/hooks/use-toast';
import { Uniform } from '@/app/admin/profile/uniform/types';

type UniformEditDialogProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    initialUniform: Uniform | null;
    onSaveSuccess: () => void;
};

export default function UniformEditDialog({
    isOpen,
    onOpenChange,
    initialUniform,
    onSaveSuccess,
}: UniformEditDialogProps) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [selectedUniform, setSelectedUniform] = useState<Uniform | null>(
        initialUniform,
    );
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        setSelectedUniform(initialUniform);
        setImageFile(null);
    }, [initialUniform]);

    const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedUniform) return;

        const formData = new FormData();
        formData.append('description', selectedUniform.description || '');
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
                result = await createUniform(formData);
            } else {
                result = await updateUniform(formData);
            }

            if (result.success) {
                toast({
                    title: 'Sukses!',
                    description: isCreating
                        ? 'Seragam berhasil ditambahkan.'
                        : 'Seragam berhasil diperbarui.',
                });
                onSaveSuccess();
                onOpenChange(false);
            } else {
                toast({
                    title: 'Gagal!',
                    description: result.message,
                    variant: 'destructive',
                });
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit Seragam{' '}
                        {selectedUniform?.day ||
                            (selectedUniform?.type === 'sport' && 'Olahraga')}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="description-edit">Deskripsi</Label>
                        <Input
                            id="description-edit"
                            name="description"
                            defaultValue={selectedUniform?.description || ''}
                            onChange={(e) =>
                                setSelectedUniform((prev) =>
                                    prev
                                        ? {
                                              ...prev,
                                              description: e.target.value,
                                          }
                                        : null,
                                )
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
                                <p className="text-sm text-muted-foreground">
                                    Tidak ada gambar saat ini.
                                </p>
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
                            onClick={() => onOpenChange(false)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
