
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
import { PlusCircle, MoreHorizontal, Trash2, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { type Achievement } from "@prisma/client";
import { AchievementSchema, createAchievement, updateAchievement, deleteAchievement, getAchievements } from "./actions";
import type { z } from "zod";

type AchievementValues = z.infer<typeof AchievementSchema>;

export default function AchievementsAdminPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchAchievements() {
      const data = await getAchievements();
      setAchievements(data);
    }
    fetchAchievements();
  }, []);

  const form = useForm<AchievementValues>({
    resolver: zodResolver(AchievementSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleOpenDialog = (achievement?: Achievement) => {
    if (achievement) {
      setSelectedAchievement(achievement);
      form.reset({
        title: achievement.title,
        student: achievement.student,
        description: achievement.description,
        hint: achievement.hint ?? undefined,
      });
      setPreviewImage(achievement.imageUrl);
      setEditOpen(true);
    } else {
      setSelectedAchievement(null);
      form.reset({ title: "", student: "", description: "", hint: "" });
      setPreviewImage(null);
      setAddOpen(true);
    }
  };
  
  const handleCloseDialog = () => {
    setAddOpen(false);
    setEditOpen(false);
    setPreviewImage(null);
    form.reset();
  }

  const onSubmit = (data: AchievementValues) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
          formData.append(key, (data as any)[key]);
        });
        const imageFile = (document.getElementById(selectedAchievement ? 'file-upload-edit' : 'file-upload-add') as HTMLInputElement)?.files?.[0];
        if (imageFile) {
          formData.append('image', imageFile);
        }

        const result = selectedAchievement
          ? await updateAchievement(selectedAchievement.id, selectedAchievement.imageUrl || '', formData)
          : await createAchievement(formData);

        if (result.success && result.data) {
           if (selectedAchievement) {
            setAchievements(achievements.map(a => a.id === result.data!.id ? result.data! : a));
          } else {
            setAchievements([result.data!, ...achievements]);
          }
          toast({ title: "Sukses", description: `Prestasi berhasil ${selectedAchievement ? 'diperbarui' : 'ditambahkan'}.` });
          handleCloseDialog();
        } else {
          toast({ title: "Error", description: result.message, variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Error", description: "Terjadi kesalahan.", variant: "destructive" });
      }
    });
  };
  
  const handleDeleteConfirm = () => {
    if (!selectedAchievement) return;
    startTransition(async () => {
      try {
        const result = await deleteAchievement(selectedAchievement.id, selectedAchievement.imageUrl || null);
        if (result.success) {
          setAchievements(achievements.filter(a => a.id !== selectedAchievement.id));
          toast({ title: "Sukses", description: "Prestasi telah dihapus." });
          setDeleteOpen(false);
          setSelectedAchievement(null);
        } else {
          toast({ title: "Error", description: result.message, variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Error", description: "Terjadi kesalahan saat menghapus.", variant: "destructive" });
      }
    });
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
        <Dialog open={isAddOpen} onOpenChange={(isOpen) => { if (!isOpen) handleCloseDialog(); else setAddOpen(true);}}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Prestasi
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Prestasi Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Gambar</Label>
                 {previewImage && <Image src={previewImage} alt="Preview" width={200} height={200} className="w-full rounded-md object-cover" />}
                <Input id="file-upload-add" name="image" type="file" onChange={handleFileChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Judul</Label>
                <Input id="title" {...form.register("title")} />
                {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="student">Siswa/Tim</Label>
                <Input id="student" {...form.register("student")} />
                {form.formState.errors.student && <p className="text-sm text-destructive">{form.formState.errors.student.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea id="description" {...form.register("description")} />
                {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
              </div>
               <div className="space-y-2">
                <Label htmlFor="hint">Petunjuk AI untuk Gambar</Label>
                <Input id="hint" {...form.register("hint")} />
                {form.formState.errors.hint && <p className="text-sm text-destructive">{form.formState.errors.hint.message}</p>}
              </div>
              <DialogFooter>
                 <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isPending}>Batal</Button>
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
                <TableHead>Judul</TableHead>
                <TableHead>Siswa/Tim</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {achievements.map((item) => (
                <TableRow key={item.id}>
                    <TableCell>
                        <Image src={item.imageUrl || "https://placehold.co/80x80.png"} alt={item.title} width={80} height={80} className="h-16 w-16 rounded-md object-cover"/>
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
                        <DropdownMenuItem onSelect={() => handleOpenDialog(item)}>
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

       <Dialog open={isEditOpen} onOpenChange={(isOpen) => { if (!isOpen) handleCloseDialog(); else setEditOpen(true);}}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Prestasi</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Gambar</Label>
                {previewImage && <Image src={previewImage} alt="Preview" width={200} height={200} className="w-full rounded-md object-cover" />}
                <Input id="file-upload-edit" name="image" type="file" onChange={handleFileChange}/>
                <p className="text-xs text-muted-foreground">Biarkan kosong jika tidak ingin mengubah gambar.</p>
              </div>
               <div className="space-y-2">
                <Label htmlFor="title-edit">Judul</Label>
                <Input id="title-edit" {...form.register("title")} />
                 {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-edit">Siswa/Tim</Label>
                <Input id="student-edit" {...form.register("student")} />
                {form.formState.errors.student && <p className="text-sm text-destructive">{form.formState.errors.student.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description-edit">Deskripsi</Label>
                <Textarea id="description-edit" {...form.register("description")} />
                {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="hint-edit">Petunjuk AI untuk Gambar</Label>
                <Input id="hint-edit" {...form.register("hint")} />
                {form.formState.errors.hint && <p className="text-sm text-destructive">{form.formState.errors.hint.message}</p>}
              </div>
              <DialogFooter>
                 <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isPending}>Batal</Button>
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
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data prestasi secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedAchievement(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={isPending}>
              {isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
