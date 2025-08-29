'use client';

import { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle, MoreHorizontal, Trash2, Pencil, Upload } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { createExtracurricular, updateExtracurricular, deleteExtracurricular } from './actions';
import { db } from '@/lib/db';
import { extracurriculars } from '@/lib/db/schema';

type Extracurricular = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string | null;
};

export default function ExtracurricularAdminPage() {
  const [activities, setActivities] = useState<Extracurricular[]>([]);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Extracurricular | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function getActivities() {
      const data = await db.query.extracurriculars.findMany();
      setActivities(data);
    }
    getActivities();
  }, []);

  const handleAdd = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    startTransition(async () => {
      const result = await createExtracurricular(formData);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        setAddOpen(false);
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    });
  };

  const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedActivity) return;

    const formData = new FormData(event.currentTarget);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    startTransition(async () => {
      const result = await updateExtracurricular(selectedActivity.id, formData);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        setEditOpen(false);
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    });
  };

  const handleDeleteConfirm = async () => {
    if (!selectedActivity) return;

    startTransition(async () => {
      const result = await deleteExtracurricular(selectedActivity.id);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        setDeleteOpen(false);
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
            Kelola Ekstrakurikuler
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Tambah, edit, atau hapus data kegiatan ekstrakurikuler.
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Kegiatan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Kegiatan Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
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
                        onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                      />
                    </Label>
                    {imageFile && <p className="text-sm text-gray-500">Selected: {imageFile.name}</p>}
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="name-add">Nama Kegiatan</Label>
                <Input id="name-add" name="name" required />
              </div>
              <div>
                <Label htmlFor="category-add">Kategori</Label>
                <Input id="category-add" name="category" placeholder="Contoh: Olahraga" required />
              </div>
              <div>
                <Label htmlFor="description-add">Deskripsi Singkat</Label>
                <Textarea id="description-add" name="description" required />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gambar</TableHead>
                <TableHead>Nama Kegiatan</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Image
                      src={item.image || 'https://placehold.co/80x53.png'}
                      alt={item.name}
                      width={80}
                      height={53}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => {
                            setSelectedActivity(item);
                            setEditOpen(true);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            setSelectedActivity(item);
                            setDeleteOpen(true);
                          }}
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
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
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Kegiatan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <Label>Gambar</Label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <Label
                    htmlFor="file-upload-edit"
                    className="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none hover:text-primary/80"
                  >
                    <span>Ganti file</span>
                    <Input
                      id="file-upload-edit"
                      type="file"
                      className="sr-only"
                      onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                    />
                  </Label>
                  {imageFile && <p className="text-sm text-gray-500">Selected: {imageFile.name}</p>}
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="name-edit">Nama Kegiatan</Label>
              <Input id="name-edit" name="name" defaultValue={selectedActivity?.name} required />
            </div>
            <div>
              <Label htmlFor="category-edit">Kategori</Label>
              <Input id="category-edit" name="category" defaultValue={selectedActivity?.category} required />
            </div>
            <div>
              <Label htmlFor="description-edit">Deskripsi</Label>
              <Textarea id="description-edit" name="description" defaultValue={selectedActivity?.description} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </DialogFooter>
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
            <AlertDialogCancel onClick={() => setSelectedActivity(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
            >
              {isPending ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}