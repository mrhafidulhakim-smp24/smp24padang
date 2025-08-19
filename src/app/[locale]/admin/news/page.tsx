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
import { PlusCircle, MoreHorizontal, Trash2, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NewsArticle = {
  id: string;
  title: string;
  date: string;
  description: string;
};

const initialNews: NewsArticle[] = [
  {
    id: "1",
    title: "Annual Sports Day Gala",
    date: "2024-03-15",
    description: "A day of thrilling competitions and spectacular performances.",
  },
  {
    id: "2",
    title: "Science Fair Innovations",
    date: "2024-03-10",
    description: "Our students showcase their groundbreaking science projects.",
  },
  {
    id: "3",
    title: "Art Exhibition 'Creative Canvases'",
    date: "2024-03-05",
    description: "Explore the vibrant world of art created by our talented students.",
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
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Berita Baru</DialogTitle>
              <DialogDescription>
                Isi detail di bawah ini untuk menambahkan artikel berita baru.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddNews}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Judul
                  </Label>
                  <Input id="title" name="title" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Tanggal
                  </Label>
                  <Input id="date" name="date" type="date" className="col-span-3" defaultValue={new Date().toISOString().substring(0, 10)} required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Deskripsi
                  </Label>
                  <Textarea id="description" name="description" className="col-span-3" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Simpan</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">Judul</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedNews.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.date}</TableCell>
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
      </div>

       {/* Edit Dialog */}
       <Dialog open={isEditOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Berita</DialogTitle>
              <DialogDescription>
                Perbarui detail artikel berita di bawah ini.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditNews}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title-edit" className="text-right">
                    Judul
                  </Label>
                  <Input id="title-edit" name="title" className="col-span-3" defaultValue={selectedNews?.title} required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date-edit" className="text-right">
                    Tanggal
                  </Label>
                  <Input id="date-edit" name="date" type="date" className="col-span-3" defaultValue={selectedNews?.date} required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description-edit" className="text-right">
                    Deskripsi
                  </Label>
                  <Textarea id="description-edit" name="description" className="col-span-3" defaultValue={selectedNews?.description} required />
                </div>
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
