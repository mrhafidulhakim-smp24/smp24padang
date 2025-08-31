'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { updateOrganizationStructure } from '../actions';
import { Pencil, Upload } from 'lucide-react';
import type { organizationStructures as OrganizationStructure } from '@/lib/db/schema';
import { type InferSelectModel } from 'drizzle-orm';

type Structure = InferSelectModel<typeof OrganizationStructure>;

type OrganizationStructureListProps = {
    initialData: Structure[];
};

export default function OrganizationStructureList({ initialData }: OrganizationStructureListProps) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [structures, setStructures] = useState(initialData);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedStructure, setSelectedStructure] = useState<Structure | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const openDialog = (structure: Structure) => {
        setSelectedStructure(structure);
        setPreview(structure.imageUrl);
        setImageFile(null);
        setDialogOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedStructure) return;

        const formData = new FormData(e.currentTarget);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        startTransition(async () => {
            const result = await updateOrganizationStructure(
                selectedStructure.type,
                selectedStructure.imageUrl,
                formData
            );

            if (result.success) {
                toast({ title: 'Sukses!', description: result.message });
                // Optimistic update
                const newStructures = structures.map(s => 
                    s.type === selectedStructure.type 
                        ? { ...s, title: formData.get('title') as string, description: formData.get('description') as string, imageUrl: preview } 
                        : s
                );
                setStructures(newStructures);
                setDialogOpen(false);
            } else {
                toast({ title: 'Gagal!', description: String(result.error), variant: 'destructive' });
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Kelola Struktur Organisasi</CardTitle>
                <CardDescription className="mt-2 text-lg">
                    Perbarui gambar dan detail untuk setiap bagan struktur organisasi.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {structures.map((structure) => (
                        <Card key={structure.type}>
                            <CardHeader>
                                <CardTitle>{structure.title}</CardTitle>
                                <CardDescription>{structure.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="relative aspect-video w-full bg-muted rounded-md overflow-hidden">
                                    {structure.imageUrl ? (
                                        <Image
                                            src={structure.imageUrl}
                                            alt={structure.title}
                                            fill
                                            className="object-contain"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground">
                                            Tidak ada gambar
                                        </div>
                                    )}
                                </div>
                                <Button onClick={() => openDialog(structure)} className="w-full">
                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit {selectedStructure?.title}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Judul</Label>
                            <Input id="title" name="title" defaultValue={selectedStructure?.title} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea id="description" name="description" defaultValue={selectedStructure?.description || ''} />
                        </div>
                        <div className="space-y-2">
                            <Label>Gambar Struktur</Label>
                            {preview && <Image src={preview} alt="Preview" width={200} height={112} className="rounded-md object-contain bg-muted" />}
                            <Input 
                                type="file" 
                                name="image"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setImageFile(file);
                                        setPreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
