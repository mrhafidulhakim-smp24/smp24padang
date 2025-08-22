
"use client";

import { useState, useMemo } from "react";
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

type Achievement = {
  id: string;
  title: string;
  student: string;
  description: string;
  image: string;
  hint: string;
};

const initialAchievements: Achievement[] = [
    { id: "1", title: "National Science Olympiad Winner", student: "Andi Pratama", description: "Secured the gold medal in the National Science Olympiad, showcasing exceptional talent in Physics.", image: "https://placehold.co/600x400.png", hint: "science award" },
    { id: "2", title: "Regional Basketball Champions", student: "School Team", description: "Our basketball team clinched the regional championship title after an undefeated season.", image: "https://placehold.co/600x400.png", hint: "basketball team" },
    { id: "3", title: "International Art Competition Finalist", student: "Citra Lestari", description: "Recognized for her outstanding painting in the 'Future Visions' international art competition.", image: "https://placehold.co/600x400.png", hint: "art painting" },
];

export default function AchievementsAdminPage() {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const handleAddAchievement = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newAchievement: Achievement = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      student: formData.get("student") as string,
      description: formData.get("description") as string,
      image: "https://placehold.co/600x400.png", // Placeholder
      hint: "new achievement"
    };
    setAchievements([newAchievement, ...achievements]);
    setAddOpen(false);
  };

  const handleEditAchievement = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedAchievement) return;
    
    const formData = new FormData(event.currentTarget);
    const updatedAchievement: Achievement = {
      ...selectedAchievement,
      title: formData.get("title") as string,
      student: formData.get("student") as string,
      description: formData.get("description") as string,
    };

    setAchievements(achievements.map(a => a.id === selectedAchievement.id ? updatedAchievement : a));
    setEditOpen(false);
    setSelectedAchievement(null);
  };
  
  const handleDeleteConfirm = () => {
    if (!selectedAchievement) return;
    setAchievements(achievements.filter(a => a.id !== selectedAchievement.id));
    setDeleteOpen(false);
    setSelectedAchievement(null);
  };

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
            Kelola Prestasi
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Tambah, edit, atau hapus data prestasi.
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Prestasi
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Prestasi Baru</DialogTitle>
              <DialogDescription>
                Isi detail di bawah ini untuk menambahkan prestasi baru.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddAchievement} className="space-y-4">
              <div>
                <Label htmlFor="image-add">Gambar</Label>
                 <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                    <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                            <Label htmlFor="file-upload-add" className="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:text-primary/80">
                                <span>Unggah file</span>
                                 <Input id="file-upload-add" name="file-upload" type="file" className="sr-only" />
                            </Label>
                            <p className="pl-1">atau seret dan lepas</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 10MB</p>
                    </div>
                 </div>
              </div>
              <div>
                <Label htmlFor="title">Judul</Label>
                <Input id="title" name="title" required />
              </div>
              <div>
                <Label htmlFor="student">Siswa/Tim</Label>
                <Input id="student" name="student" required />
              </div>
              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea id="description" name="description" required />
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
                <TableHead>Judul</TableHead>
                <TableHead>Siswa/Tim</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {achievements.map((item) => (
                <TableRow key={item.id}>
                    <TableCell>
                        <Image src={item.image} alt={item.title} width={80} height={80} className="h-16 w-16 rounded-md object-cover"/>
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.student}</TableCell>
                    <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => { setSelectedAchievement(item); setEditOpen(true); }}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => { setSelectedAchievement(item); setDeleteOpen(true); }} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
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
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Prestasi</DialogTitle>
              <DialogDescription>
                Perbarui detail prestasi di bawah ini.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditAchievement} className="space-y-4">
              <div>
                <Label htmlFor="image-edit">Gambar</Label>
                 <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                    <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                            <Label htmlFor="file-upload-edit" className="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:text-primary/80">
                                <span>Ganti file</span>
                                 <Input id="file-upload-edit" name="file-upload" type="file" className="sr-only" />
                            </Label>
                            <p className="pl-1">atau seret dan lepas</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 10MB</p>
                    </div>
                 </div>
              </div>
              <div>
                <Label htmlFor="title-edit">Judul</Label>
                <Input id="title-edit" name="title" defaultValue={selectedAchievement?.title} required />
              </div>
              <div>
                <Label htmlFor="student-edit">Siswa/Tim</Label>
                <Input id="student-edit" name="student" defaultValue={selectedAchievement?.student} required />
              </div>
              <div>
                <Label htmlFor="description-edit">Deskripsi</Label>
                <Textarea id="description-edit" name="description" defaultValue={selectedAchievement?.description} required />
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
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data prestasi secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedAchievement(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

    