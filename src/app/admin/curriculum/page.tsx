'use client';

import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useTransition } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PDFViewer } from '@/components/pdf-viewer';
import {
    getCurriculum,
    createCurriculum,
    updateCurriculum,
    deleteCurriculum,
} from '@/lib/db/queries/curriculum';
import type { Curriculum } from '@/types/curriculum';

const categories = [
    { value: 'kurikulum', label: 'Kurikulum' },
    { value: 'kesiswaan', label: 'Kesiswaan' },
    { value: 'sarana-prasarana', label: 'Sarana & Prasarana' },
];

export default function CurriculumPage() {
    const { toast } = useToast();
    const [documents, setDocuments] = useState<Curriculum[]>([]);
    const [editingDoc, setEditingDoc] = useState<Curriculum | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('kurikulum');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        pdfUrl: '',
        category: 'kurikulum',
    });

    useEffect(() => {
        loadDocuments();
    }, []);

    useEffect(() => {
        // Reset form when category changes, unless we are editing
        if (!editingDoc) {
            setFormData((prev) => ({
                ...prev,
                title: '',
                description: '',
                pdfUrl: '',
                category: selectedCategory,
            }));
        }
    }, [selectedCategory, editingDoc]);

    async function loadDocuments() {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getCurriculum();
            if (result.data) {
                setDocuments(result.data);
            }
            if (result.error) {
                throw new Error(result.error);
            }
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleEdit = (doc: Curriculum) => {
        setEditingDoc(doc);
        setFormData({
            title: doc.title,
            description: doc.description,
            pdfUrl: doc.pdfUrl,
            category: doc.category,
        });
        setSelectedCategory(doc.category);
    };

    const handleDelete = (id: number) => {
        startTransition(async () => {
            try {
                const result = await deleteCurriculum(id);
                if (result.error) {
                    throw new Error(result.error);
                }
                toast({ title: 'Berhasil', description: 'Dokumen dihapus.' });
                await loadDocuments();
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Gagal menghapus dokumen.',
                    variant: 'destructive',
                });
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        startTransition(async () => {
            try {
                if (editingDoc) {
                    const result = await updateCurriculum(editingDoc.id, formData);
                    if (result.error) throw new Error(result.error);
                    toast({
                        title: 'Berhasil',
                        description: 'Dokumen diupdate.',
                    });
                } else {
                    const result = await createCurriculum(formData);
                    if (result.error) throw new Error(result.error);
                    toast({
                        title: 'Berhasil',
                        description: 'Dokumen ditambahkan.',
                    });
                }
                setEditingDoc(null);
                setFormData({
                    title: '',
                    description: '',
                    pdfUrl: '',
                    category: selectedCategory,
                });
                await loadDocuments();
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Gagal menyimpan dokumen.',
                    variant: 'destructive',
                });
            }
        });
    };

    const handleCancelEdit = () => {
        setEditingDoc(null);
        setFormData({
            title: '',
            description: '',
            pdfUrl: '',
            category: selectedCategory,
        });
    };

    const filteredDocuments = documents.filter(
        (doc) => doc.category === selectedCategory,
    );

    return (
        <div className="space-y-6">
            <Tabs
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-3 bg-muted p-0 border-b">
                    {categories.map((category) => (
                        <TabsTrigger 
                            key={category.value} 
                            value={category.value}
                            className="font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none"
                        >
                            {category.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <Card className="p-6 my-6">
                    <h2 className="text-2xl font-bold mb-4">
                        {editingDoc
                            ? `Edit Dokumen di ${selectedCategory}`
                            : `Tambah Dokumen ke ${selectedCategory}`}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Judul</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        title: e.target.value,
                                    }))
                                }
                                placeholder="Masukkan judul dokumen"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                placeholder="Masukkan deskripsi dokumen"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pdfUrl">URL PDF (Google Drive)</Label>
                            <Input
                                id="pdfUrl"
                                value={formData.pdfUrl}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        pdfUrl: e.target.value,
                                    }))
                                }
                                placeholder="Masukkan URL Google Drive PDF"
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" disabled={isPending}>
                                {isPending
                                    ? 'Menyimpan...'
                                    : editingDoc
                                    ? 'Update Dokumen'
                                    : 'Simpan Dokumen'}
                            </Button>
                            {editingDoc && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancelEdit}
                                >
                                    Batal
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>

                {categories.map((category) => (
                    <TabsContent key={category.value} value={category.value} className="mt-4">
                        {isLoading ? (
                            <p>Memuat dokumen...</p>
                        ) : error ? (
                            <p className="text-red-500">Error: {error}</p>
                        ) : filteredDocuments.length === 0 ? (
                            <p>Tidak ada dokumen untuk kategori ini.</p>
                        ) : (
                            <div className="grid gap-8">
                                {filteredDocuments.map((doc) => (
                                    <Card
                                        key={doc.id}
                                        className="p-6 space-y-4 hover:shadow-md transition-shadow flex flex-col"
                                    >
                                        <div className="flex-grow">
                                            <div className="aspect-[4/3] mb-3 rounded overflow-hidden border">
                                                <PDFViewer
                                                    url={doc.pdfUrl}
                                                    title={doc.title}
                                                />
                                            </div>
                                            <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                                                {doc.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                                {doc.description}
                                            </p>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-2 flex-shrink-0">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(doc)}
                                            >
                                                <Pencil className="h-4 w-4 mr-1" />
                                                Edit
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Hapus
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Hapus Dokumen?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Tindakan ini tidak dapat
                                                            dibatalkan. Dokumen akan
                                                            dihapus secara permanen.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Batal
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() =>
                                                                handleDelete(doc.id)
                                                            }
                                                        >
                                                            Hapus
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}