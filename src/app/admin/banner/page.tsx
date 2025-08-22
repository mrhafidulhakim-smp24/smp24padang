
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

type Banner = {
  id: string;
  title: string;
  description: string;
  image: string;
  hint: string;
};

const initialBanners: Banner[] = [
    { id: "1", title: "Selamat Datang di SMPN 24 Padang", description: "Membina Pikiran, Membentuk Masa Depan. Jelajahi dunia pembelajaran dan penemuan kami.", image: "https://placehold.co/1920x1080.png", hint: "school campus" },
    { id: "2", title: "Penerimaan Siswa Baru 2024/2025", description: "Jadilah bagian dari komunitas kami yang berprestasi. Pendaftaran telah dibuka!", image: "https://placehold.co/1920x1080.png", hint: "students registration" },
    { id: "3", title: "Juara Umum Lomba Cerdas Cermat", description: "Siswa kami kembali mengharumkan nama sekolah di tingkat nasional.", image: "https://placehold.co/1920x1080.png", hint: "students winning trophy" },
];

export default function BannerAdminPage() {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

  const handleAddBanner = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newBanner: Banner = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      image: "https://placehold.co/1920x1080.png", // Placeholder
      hint: "new banner"
    };
    setBanners([newBanner, ...banners]);
    setAddOpen(false);
  };

  const handleEditBanner = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedBanner) return;
    
    const formData = new FormData(event.currentTarget);
    const updatedBanner: Banner = {
      ...selectedBanner,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
    };

    setBanners(banners.map(a => a.id === selectedBanner.id ? updatedBanner : a));
    setEditOpen(false);
    setSelectedBanner(null);
  };
  
  const handleDeleteConfirm = () => {
    if (!selectedBanner) return;
    setBanners(banners.filter(a => a.id !== selectedBanner.id));
    setDeleteOpen(false);
    setSelectedBanner(null);
  };

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
            Kelola Banner Beranda
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Tambah, edit, atau hapus banner yang tampil di halaman utama.
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Banner Baru</DialogTitle>
              <DialogDescription>
                Isi detail di bawah ini untuk menambahkan banner baru.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddBanner} className="space-y-4">
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
                <Label htmlFor="title">Judul Banner</Label>
                <Input id="title" name="title" required />
              </div>
              <div>
                <Label htmlFor="description">Deskripsi Singkat</Label>
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
                <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {banners.map((item) => (
                <TableRow key={item.id}>
                    <TableCell>
                        <Image src={item.image} alt={item.title} width={120} height={67} className="rounded-md object-cover"/>
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => { setSelectedBanner(item); setEditOpen(true); }}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => { setSelectedBanner(item); setDeleteOpen(true); }} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
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
              <DialogTitle>Edit Banner</DialogTitle>
              <DialogDescription>
                Perbarui detail banner di bawah ini.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditBanner} className="space-y-4">
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
                <Label htmlFor="title-edit">Judul Banner</Label>
                <Input id="title-edit" name="title" defaultValue={selectedBanner?.title} required />
              </div>
              <div>
                <Label htmlFor="description-edit">Deskripsi</Label>
                <Textarea id="description-edit" name="description" defaultValue={selectedBanner?.description} required />
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
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus banner secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedBanner(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
