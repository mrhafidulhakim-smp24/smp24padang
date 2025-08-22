
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  category: string;
  hint: string;
};

const initialGalleryItems: GalleryItem[] = [
  { id: "1", src: "https://placehold.co/600x400.png", alt: "Kegiatan Belajar Mengajar di Kelas", category: "Akademik", hint: "classroom students" },
  { id: "2", src: "https://placehold.co/600x400.png", alt: "Tim Basket Sekolah Merayakan Kemenangan", category: "Olahraga", hint: "basketball team celebration" },
  { id: "3", src: "https://placehold.co/600x400.png", alt: "Pameran Seni Siswa", category: "Seni & Budaya", hint: "student art exhibition" },
  { id: "4", src: "https://placehold.co/600x400.png", alt: "Siswa Melakukan Percobaan di Laboratorium Sains", category: "Sains", hint: "science lab students" },
];

export default function GalleryAdminPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGalleryItems);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const handleAddItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newItem: GalleryItem = {
      id: Date.now().toString(),
      alt: formData.get("alt") as string,
      category: formData.get("category") as string,
      src: "https://placehold.co/600x400.png", // Placeholder, ideally this would be an upload
      hint: "new image",
    };
    setGalleryItems([newItem, ...galleryItems]);
    setAddOpen(false);
  };
  
  const handleDeleteConfirm = () => {
    if (!selectedItem) return;
    setGalleryItems(galleryItems.filter(item => item.id !== selectedItem.id));
    setDeleteOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
            Kelola Galeri
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Tambah atau hapus gambar dari galeri sekolah.
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Gambar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Gambar Baru</DialogTitle>
              <DialogDescription>
                Isi detail di bawah ini untuk menambahkan gambar baru.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <Label htmlFor="alt">Judul/Deskripsi Gambar</Label>
                <Input id="alt" name="alt" required />
              </div>
              <div>
                <Label htmlFor="category">Kategori</Label>
                <Input id="category" name="category" required />
              </div>
              <DialogFooter>
                <Button type="submit">Simpan</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {galleryItems.map((item) => (
              <div key={item.id} className="group relative">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={400}
                  height={400}
                  className="aspect-square w-full rounded-lg object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setSelectedItem(item);
                      setDeleteOpen(true);
                    }}
                  >
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Hapus Gambar</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus gambar dari galeri secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedItem(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
