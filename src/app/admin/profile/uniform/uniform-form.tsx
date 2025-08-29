'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, PlusCircle } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { createUniform } from './actions';
import { useToast } from '@/hooks/use-toast';

export default function UniformForm() {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setImagePreview(null);
        }
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
            formRef.current?.reset();
            setImageFile(null);
            setImagePreview(null);
        } else {
            toast({
                title: 'Error',
                description: result.message,
                variant: 'destructive',
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <PlusCircle className="h-6 w-6" />
                    Tambah Seragam Baru
                </CardTitle>
                <CardDescription>
                    Gunakan formulir ini untuk menambahkan seragam baru ke daftar.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                         <div>
                            <Label htmlFor="day">Hari</Label>
                            <Input
                                id="day"
                                name="day"
                                placeholder="Contoh: Senin - Selasa"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Deskripsi</Label>
                            <Input
                                id="description"
                                name="description"
                                placeholder="Contoh: Baju putih, celana biru"
                                required
                            />
                        </div>
                    </div>
                   
                    <div>
                        <Label>Gambar Seragam</Label>
                        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                            <div className="space-y-1 text-center">
                                {imagePreview ? (
                                    <Image src={imagePreview} alt="Preview" width={200} height={300} className="mx-auto h-48 w-auto object-contain"/>
                                ) : (
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                )}
                                <Label
                                    htmlFor="file-upload-new"
                                    className="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none hover:text-primary/80"
                                >
                                    <span>{imageFile ? 'Ganti gambar' : 'Unggah file'}</span>
                                    <Input
                                        id="file-upload-new"
                                        name="image"
                                        type="file"
                                        className="sr-only"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                </Label>
                                {imageFile && (
                                    <p className="text-sm text-gray-500">
                                        {imageFile.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit">Tambah Seragam</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
