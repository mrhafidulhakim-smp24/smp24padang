
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

type NewsArticle = {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  hint: string;
};

const initialNews: NewsArticle[] = [
  {
    id: "1",
    title: "Jadwal Ujian Akhir Semester (UAS) Genap",
    date: "2024-05-20",
    description: "Ujian Akhir Semester untuk tahun ajaran 2023/2024 akan dilaksanakan mulai tanggal 3 Juni hingga 7 Juni 2024. Harap siswa mempersiapkan diri.",
    image: "https://placehold.co/600x400.png",
    hint: "students exam"
  },
  {
    id: "2",
    title: "Pendaftaran Ekstrakurikuler Tahun Ajaran Baru",
    date: "2024-05-18",
    description: "Pendaftaran untuk seluruh kegiatan ekstrakurikuler tahun ajaran 2024/2025 akan dibuka pada tanggal 15 Juli 2024.",
    image: "https://placehold.co/600x400.png",
    hint: "student activities"
  },
  {
    id: "3",
    title: "Informasi Libur Kenaikan Kelas",
    date: "2024-05-15",
    description: "Libur akhir tahun ajaran akan dimulai pada tanggal 10 Juni 2024 dan siswa akan kembali masuk pada tanggal 8 Juli 2024.",
    image: "https://placehold.co/600x400.png",
    hint: "school holiday"
  },
];

export default function NewsAdminPage() {
  const [news, setNews] = useState<NewsArticle[]>(initialNews);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);

  const handleAddNews = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newArticle: NewsArticle = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      date: formData.get("date") as string,
      description: formData.get("description") as string,
      image: "https://placehold.co/600x400.png",
      hint: "new news"
    };
    setNews([newArticle, ...news]);
    setAddOpen(false);
  };

  const handleEditNews = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedNews) return;
    
    const formData = new FormData(event.currentTarget);
    const updatedArticle: NewsArticle = {
      ...selectedNews,
      title: formData.get("title") as string,
      date: formData.get("date") as string,
      description: formData.get("description") as string,
    };

    setNews(news.map(n => n.id === selectedNews.id ? updatedArticle : n));
    setEditOpen(false);
    setSelectedNews(null);
  };
  
  const handleDeleteConfirm = () => {
    if (!selectedNews) return;
    setNews(news.filter(n => n.id !== selectedNews.id));
    setDeleteOpen(false);
    setSelectedNews(null);
  };

  const sortedNews = useMemo(() => {
    return [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [news]);

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
            Kelola Berita
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Tambah, edit, atau hapus berita dan pengumuman.
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Berita Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Berita Baru</DialogTitle>
              <DialogDescription>
                Isi detail di bawah ini untuk menambahkan artikel berita baru.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddNews} className="space-y-4">
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
                  <Label htmlFor="date">Tanggal</Label>
                  <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().substring(0, 10)} required />
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
                <TableHead className="w-1/2">Judul</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedNews.map((item) => (
                <TableRow key={item.id}>
                    <TableCell>
                       <Image src={item.image} alt={item.title} width={80} height={80} className="h-16 w-16 rounded-md object-cover"/>
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => { setSelectedNews(item); setEditOpen(true); }}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => { setSelectedNews(item); setDeleteOpen(true); }} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
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

       {/* Edit Dialog */}
       <Dialog open={isEditOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Berita</DialogTitle>
              <DialogDescription>
                Perbarui detail artikel berita di bawah ini.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditNews} className="space-y-4">
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
                  <Input id="title-edit" name="title" defaultValue={selectedNews?.title} required />
                </div>
                <div>
                  <Label htmlFor="date-edit">Tanggal</Label>
                  <Input id="date-edit" name="date" defaultValue={selectedNews?.date} required />
                </div>
                <div>
                  <Label htmlFor="description-edit">Deskripsi</Label>
                  <Textarea id="description-edit" name="description" defaultValue={selectedNews?.description} required />
                </div>
              <DialogFooter>
                 <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Batal</Button>
                 <Button type="submit">Simpan Perubahan</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus artikel berita secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedNews(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

    
