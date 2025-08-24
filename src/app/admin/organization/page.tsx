
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

type OrgChart = {
  id: string;
  title: string;
  image: string;
};

const initialCharts: OrgChart[] = [
  { id: "1", title: "Struktur Pimpinan Sekolah", image: "https://placehold.co/1200x800.png" },
  { id: "2", title: "Struktur Organisasi Siswa Intra Sekolah (OSIS)", image: "https://placehold.co/1200x800.png" },
];

export default function OrganizationAdminPage() {
  const [charts, setCharts] = useState<OrgChart[]>(initialCharts);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState<OrgChart | null>(null);

  const handleAddChart = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newChart: OrgChart = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      image: "https://placehold.co/1200x800.png",
    };
    setCharts([newChart, ...charts]);
    setAddOpen(false);
    (event.target as HTMLFormElement).reset();
  };

  const handleEditChart = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedChart) return;
    
    const formData = new FormData(event.currentTarget);
    const updatedChart: OrgChart = {
      ...selectedChart,
      title: formData.get("title") as string,
    };

    setCharts(charts.map(s => s.id === selectedChart.id ? updatedChart : s));
    setEditOpen(false);
    setSelectedChart(null);
  };
  
  const handleDeleteConfirm = () => {
    if (!selectedChart) return;
    setCharts(charts.filter(s => s.id !== selectedChart.id));
    setDeleteOpen(false);
    setSelectedChart(null);
  };

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
            Kelola Bagan Organisasi
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Tambah, edit, atau hapus gambar bagan struktur organisasi.
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Bagan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Bagan Organisasi Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddChart} className="space-y-4">
              <div>
                <Label htmlFor="title-add">Judul Bagan</Label>
                <Input id="title-add" name="title" placeholder="Contoh: Struktur Pimpinan Sekolah" required />
              </div>
              <div>
                <Label htmlFor="image-add">Gambar Bagan</Label>
                 <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                    <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <Label htmlFor="file-upload-add" className="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none hover:text-primary/80">
                            <span>Unggah file</span>
                            <Input id="file-upload-add" name="file-upload" type="file" className="sr-only" />
                        </Label>
                    </div>
                 </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Batal</Button>
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
                <TableHead className="w-[15%]">Pratinjau</TableHead>
                <TableHead>Judul Bagan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {charts.map((item) => (
                <TableRow key={item.id}>
                    <TableCell>
                        <Image src={item.image} alt={item.title} width={120} height={80} className="rounded-md object-cover"/>
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
                        <DropdownMenuItem onSelect={() => { setSelectedChart(item); setEditOpen(true); }}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => { setSelectedChart(item); setDeleteOpen(true); }} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
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
              <DialogTitle>Edit Bagan Organisasi</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditChart} className="space-y-4">
              <div>
                <Label htmlFor="title-edit">Judul Bagan</Label>
                <Input id="title-edit" name="title" defaultValue={selectedChart?.title} required />
              </div>
               <div>
                <Label htmlFor="image-edit">Ganti Gambar Bagan</Label>
                 <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                    <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                         <Label htmlFor="file-upload-edit" className="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none hover:text-primary/80">
                            <span>Unggah file baru</span>
                             <Input id="file-upload-edit" name="file-upload" type="file" className="sr-only" />
                        </Label>
                    </div>
                 </div>
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
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus bagan organisasi secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedChart(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
