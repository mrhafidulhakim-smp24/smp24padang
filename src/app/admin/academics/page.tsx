'use client';

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getAcademics, updateAcademics } from './actions';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import type { academics as AcademicsSchema } from '@/lib/db/schema';
import { type InferSelectModel } from 'drizzle-orm';

type AcademicsData = InferSelectModel<typeof AcademicsSchema>;

function ImageUpload({ 
    label, 
    name, 
    currentImageUrl, 
    onFileChange 
}: { 
    label: string, 
    name: string, 
    currentImageUrl: string | null | undefined, 
    onFileChange: (file: File | null) => void 
}) {
    const [preview, setPreview] = useState<string | null>(currentImageUrl);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
            onFileChange(file);
        } else {
            onFileChange(null);
        }
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="mt-1 flex items-center gap-4">
                {preview ? (
                    <Image src={preview} alt={`${label} Preview`} width={160} height={90} className="rounded-md object-cover bg-muted" />
                ) : (
                    <div className="flex h-[90px] w-[160px] items-center justify-center rounded-md bg-muted">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                )}
                <Input
                    name={name}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="max-w-xs"
                />
            </div>
        </div>
    );
}

export default function AcademicsAdminPage() {
    const [data, setData] = useState<AcademicsData | null>(null);
    const [curriculumImageFile, setCurriculumImageFile] = useState<File | null>(null);
    const [structureImageFile, setStructureImageFile] = useState<File | null>(null);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    useEffect(() => {
        getAcademics().then(setData);
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        if (curriculumImageFile) {
            formData.append('curriculumImage', curriculumImageFile);
        }
        if (structureImageFile) {
            formData.append('structureImage', structureImageFile);
        }
        // Pass current image URLs to the action
        formData.append('currentCurriculumImageUrl', data?.curriculumImageUrl || '');
        formData.append('currentStructureImageUrl', data?.structureImageUrl || '');

        startTransition(async () => {
            const result = await updateAcademics(formData);
            if (result.success) {
                toast({ title: 'Sukses!', description: 'Data akademik berhasil diperbarui.' });
                // Re-fetch data to get the latest version with new image URLs
                getAcademics().then(setData);
            } else {
                toast({ title: 'Gagal!', description: result.message, variant: 'destructive' });
            }
        });
    };

    if (!data) {
        return <div>Loading...</div>; // Or a skeleton loader
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">Kelola Akademik</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Kelola konten yang berkaitan dengan kurikulum dan struktur organisasi akademik.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Kurikulum</CardTitle>
                        <CardDescription>Informasi mengenai kurikulum yang digunakan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="curriculumTitle">Judul Kurikulum</Label>
                            <Input id="curriculumTitle" name="curriculumTitle" defaultValue={data.curriculumTitle} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="curriculumDescription">Deskripsi Kurikulum</Label>
                            <Textarea id="curriculumDescription" name="curriculumDescription" defaultValue={data.curriculumDescription} rows={5} required />
                        </div>
                        <ImageUpload 
                            label="Gambar Kurikulum"
                            name="curriculumImage"
                            currentImageUrl={data.curriculumImageUrl}
                            onFileChange={setCurriculumImageFile}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Struktur Organisasi</CardTitle>
                        <CardDescription>Struktur organisasi dan pembelajaran.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="structureTitle">Judul Struktur</Label>
                            <Input id="structureTitle" name="structureTitle" defaultValue={data.structureTitle} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="structureDescription">Deskripsi Struktur</Label>
                            <Textarea id="structureDescription" name="structureDescription" defaultValue={data.structureDescription} rows={5} required />
                        </div>
                        <ImageUpload 
                            label="Gambar Struktur"
                            name="structureImage"
                            currentImageUrl={data.structureImageUrl}
                            onFileChange={setStructureImageFile}
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={isPending}>
                    {isPending ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
                </Button>
            </div>
        </form>
    );
}
