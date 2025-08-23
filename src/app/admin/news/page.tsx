
"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useToast } from "@/hooks/use-toast";
// import { createNewsArticle, updateNewsArticle, deleteNewsArticle, NewsArticleSchema } from "./actions";
// import type { NewsArticle } from "@prisma/client";
import { z } from "zod";

// Mock data and functions for now, will be replaced with server actions
const NewsArticleSchema = z.object({
    title: z.string().min(1, "Judul diperlukan"),
    date: z.string().min(1, "Tanggal diperlukan"),
    description: z.string().min(1, "Deskripsi diperlukan"),
});
type NewsArticleValues = z.infer<typeof NewsArticleSchema>;

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
];


export default function NewsAdminPage() {
  const [news, setNews] = useState<NewsArticle[]>(initialNews);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<NewsArticleValues>({
    resolver: zodResolver(NewsArticleSchema),
  });

  const handleAddNews = async (data: NewsArticleValues) => {
    // startTransition(async () => {
    //   const result = await createNewsArticle(data);
    //   if (result.success) {
    //     toast({ title: "Sukses", description: "Berita baru telah ditambahkan." });
    //     setAddOpen(false);
    //   } else {
    //     toast({ title: "Error", description: result.message, variant: "destructive" });
    //   }
    // });
    console.log("Adding news:", data);
    const newArticle: NewsArticle = {
        id: Date.now().toString(),
        title: data.title,
        date: data.date,
        description: data.description,
        image: "https://placehold.co/600x400.png",
        hint: "new news"
    };
    setNews([newArticle, ...news]);
    toast({ title: "Sukses", description: "Berita baru telah ditambahkan." });
    setAddOpen(false);
  };

  const handleEditNews = async (data: NewsArticleValues) => {
    if (!selectedNews) return;
    // startTransition(async () => {
    //   const result = await updateNewsArticle(selectedNews.id, data);
    //   if (result.success) {
    //     toast({ title: "Sukses", description: "Berita telah diperbarui." });
    //     setEditOpen(false);
    //     setSelectedNews(null);
    //   } else {
    //     toast({ title: "Error", description: result.message, variant: "destructive" });
    //   }
    // });
     console.log("Editing news:", data);
     const updatedArticle: NewsArticle = {
      ...selectedNews,
      ...data,
    };
    setNews(news.map(n => n.id === selectedNews.id ? updatedArticle : n));
    toast({ title: "Sukses", description: "Berita telah diperbarui." });
    setEditOpen(false);
    setSelectedNews(null);
  };
  
  const handleDeleteConfirm = () => {
    if (!selectedNews) return;
    // startTransition(async () => {
    //   const result = await deleteNewsArticle(selectedNews.id);
    //   if (result.success) {
    //     toast({ title: "Sukses", description: "Berita telah dihapus." });
    //     setDeleteOpen(false);
    //     setSelectedNews(null);
    //   } else {
    //     toast({ title: "Error", description: result.message, variant: "destructive" });
    //   }
    // });
     console.log("Deleting news:", selectedNews.id);
     setNews(news.filter(n => n.id !== selectedNews.id));
     toast({ title: "Sukses", description: "Berita telah dihapus." });
     setDeleteOpen(false);
     setSelectedNews(null);
  };

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
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleAddNews)} className="space-y-4">
               <div>
                  <Label htmlFor="title">Judul</Label>
                  <Input id="title" {...form.register("title")} />
                  {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
                </div>
                <div>
                  <Label htmlFor="date">Tanggal</Label>
                  <Input id="date" type="date" {...form.register("date")} defaultValue={new Date().toISOString().substring(0, 10)} />
                   {form.formState.errors.date && <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>}
                </div>
                <div>
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea id="description" {...form.register("description")} />
                   {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
                </div>
              <DialogFooter>
                <Button type="submit" disabled={isPending}>{isPending ? "Menyimpan..." : "Simpan"}</Button>
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
                {news.map((item) => (
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
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => { setSelectedNews(item); form.reset({title: item.title, date: item.date.substring(0,10), description: item.description }); setEditOpen(true); }}>
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

       <Dialog open={isEditOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Berita</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleEditNews)} className="space-y-4">
              <div>
                  <Label htmlFor="title-edit">Judul</Label>
                  <Input id="title-edit" {...form.register("title")} />
                   {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
                </div>
                <div>
                  <Label htmlFor="date-edit">Tanggal</Label>
                  <Input id="date-edit" type="date" {...form.register("date")} />
                   {form.formState.errors.date && <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>}
                </div>
                <div>
                  <Label htmlFor="description-edit">Deskripsi</Label>
                  <Textarea id="description-edit" {...form.register("description")} />
                   {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
                </div>
              <DialogFooter>
                 <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Batal</Button>
                 <Button type="submit" disabled={isPending}>{isPending ? "Menyimpan..." : "Simpan Perubahan"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

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
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={isPending}>
              {isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
