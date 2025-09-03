'use client';

import { useState, useTransition } from 'react';
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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { updateOrganizationStructure } from '../actions';
import { Pencil } from 'lucide-react';
import type { organizationStructures as OrganizationStructure } from '@/lib/db/schema';
import { type InferSelectModel } from 'drizzle-orm';

type Structure = InferSelectModel<typeof OrganizationStructure>;

type OrganizationStructureListProps = {
    initialData: Structure[];
};

export default function OrganizationStructureList({
    initialData,
}: OrganizationStructureListProps) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [structures, setStructures] = useState(initialData);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedStructure, setSelectedStructure] =
        useState<Structure | null>(null);

    const openDialog = (structure: Structure) => {
        setSelectedStructure(structure);
        setDialogOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedStructure) return;

        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            // The old imageUrl is in selectedStructure.pdfUrl (due to schema rename)
            const oldImageUrl = selectedStructure.pdfUrl;

            const result = await updateOrganizationStructure(
                selectedStructure.type,
                oldImageUrl,
                formData,
            );

            if (result.success) {
                toast({ title: 'Sukses!', description: result.message });

                // Update the state with the new data from the form
                const newStructures = structures.map((s) =>
                    s.type === selectedStructure.type
                        ? {
                              ...s,
                              title: formData.get('title') as string,
                              description: formData.get(
                                  'description',
                              ) as string,
                              pdfUrl: formData.get('pdfUrl') as string,
                          }
                        : s,
                );
                setStructures(newStructures);
                setDialogOpen(false);
            } else {
                toast({
                    title: 'Gagal!',
                    description: String(result.error),
                    variant: 'destructive',
                });
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    Kelola Struktur Organisasi
                </CardTitle>
                <CardDescription className="mt-2 text-lg">
                    Perbarui link Google Drive PDF untuk setiap bagan struktur organisasi.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {structures.map((structure) => (
                        <Card key={structure.type}>
                            <CardHeader>
                                <CardTitle>{structure.title}</CardTitle>
                                <CardDescription>
                                    {structure.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 text-sm border rounded-md bg-muted truncate">
                                    {structure.pdfUrl ? (
                                        <a href={structure.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            {structure.pdfUrl}
                                        </a>
                                    ) : (
                                        <span className="text-muted-foreground">Belum ada link PDF.</span>
                                    )}
                                </div>
                                <Button
                                    onClick={() => openDialog(structure)}
                                    className="w-full"
                                >
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
                        <DialogTitle>
                            Edit {selectedStructure?.title}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Judul</Label>
                            <Input
                                id="title"
                                name="title"
                                defaultValue={selectedStructure?.title}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={
                                    selectedStructure?.description || ''
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pdfUrl">Link Google Drive PDF</Label>
                            <Input
                                id="pdfUrl"
                                name="pdfUrl"
                                type="url"
                                placeholder="https://..."
                                defaultValue={selectedStructure?.pdfUrl || ''}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                            >
                                Batal
                            </Button>
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
