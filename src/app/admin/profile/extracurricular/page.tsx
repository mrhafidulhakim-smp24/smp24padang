
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle, MoreHorizontal, Trash2, Pencil, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

type Extracurricular = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  hint: string;
};

const initialData: Extracurricular[] = [
    { id: "1", name: "Sepak Bola", category: "Olahraga", description: "Mengembangkan bakat sepak bola dan kerja sama tim.", image: "https://placehold.co/600x400.png", hint: "students playing soccer" },
    { id: "2", name: "Tari Tradisional", category: "Seni & Budaya", description: "Mempelajari dan melestarikan seni tari daerah.", image: "https://placehold.co/600x400.png", hint: "students dancing" },
    { id: "3", name: "Kelompok Ilmiah Remaja (KIR)", category: "Akademik & Sains", description: "Mendorong penelitian dan inovasi di kalangan siswa.", image: "https://placehold.co/600x400.png", hint: "students science club" },
];

export default function ExtracurricularAdminPage() {
  const [activities, setActivities] = useState<Extracurricular[]>(initialData);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Extracurricular | null>(null);

  const handleAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newData: Extracurricular = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      image: "https://placehold.co/600x400.png", // Placeholder
      hint: "extracurricular activity"
    };
    setActivities([newData, ...activities]);
    setAddOpen(false);
  };

  const handleEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedActivity) return;
    
    const formData = new FormData(event.currentTarget);
    const updatedData: Extracurricular = {
      ...selectedActivity,
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
    };

    setActivities(activities.map(a => a.id === selectedActivity.id ? updatedData : a));
    setEditOpen(false);
    setSelectedActivity(null);
  };
  
  const handleDeleteConfirm = () => {
    if (!selectedActivity) return;
    setActivities(activities.filter(a => a.id !== selectedActivity.id));
    setDeleteOpen(false);
    setSelectedActivity(null);
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
                        <Label htmlFor="file-upload-add" className="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none hover:text-primary/80">
                           <span>Unggah file</span>
                           <Input id="file-upload-add" type="file" className="sr-only" />
                        </Label>
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
                <Button type="submit">Simpan</Button>
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
                        <Image src={item.image} alt={item.name} width={80} height={53} className="rounded-md object-cover"/>
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
                        <DropdownMenuItem onSelect={() => { setSelectedActivity(item); setEditOpen(true); }}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => { setSelectedActivity(item); setDeleteOpen(true); }} className="text-destructive focus:text-destructive focus:bg-destructive/10">
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
                        <Label htmlFor="file-upload-edit" className="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none hover:text-primary/80">
                           <span>Ganti file</span>
                           <Input id="file-upload-edit" type="file" className="sr-only" />
                        </Label>
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
                 <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Batal</Button>
                 <Button type="submit">Simpan Perubahan</Button>
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
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

    
