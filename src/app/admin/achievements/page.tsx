
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFormState } from "react-dom";
import {
  MoreHorizontal,
  Pencil,
  PlusCircle,
  Trash2,
  Upload,
} from "lucide-react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  createAchievement,
  updateAchievement,
  deleteAchievement,
  getAchievements,
} from "./actions";
import { type Achievement } from "./schema";

function AchievementForm({
  action,
  initialData,
  onClose,
}: {
  action: (formData: FormData) => Promise<any>;
  initialData?: Achievement | null;
  onClose: () => void;
}) {
  const [state, formAction] = useFormState(action, {
    success: false,
    message: "",
  });
  const { toast } = useToast();
  const [preview, setPreview] = useState(initialData?.imageUrl || null);

  useEffect(() => {
    if (state.success) {
      toast({ title: "Sukses!", description: state.message });
      onClose();
    } else if (state.message) {
      toast({
        title: "Gagal",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast, onClose]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label>Gambar</Label>
        <div className="mt-1 flex items-center gap-4">
          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              width={80}
              height={80}
              className="rounded-md object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-md bg-muted">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="max-w-xs"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="title">Judul Prestasi</Label>
        <Input
          id="title"
          name="title"
          defaultValue={initialData?.title}
          required
        />
      </div>
      <div>
        <Label htmlFor="student">Siswa/Tim</Label>
        <Input
          id="student"
          name="student"
          defaultValue={initialData?.student}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={initialData?.description}
          required
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button type="submit">Simpan</Button>
      </DialogFooter>
    </form>
  );
}

export default function AchievementsAdminPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);

  useEffect(() => {
    getAchievements().then((data) => setAchievements(data as Achievement[]));
  }, []);
  
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!selectedAchievement) return;
    const result = await deleteAchievement(
      selectedAchievement.id,
      selectedAchievement.imageUrl
    );
    if (result.success) {
      toast({ title: "Sukses!", description: result.message });
      setAchievements(achievements.filter((a) => a.id !== selectedAchievement.id));
      setDeleteOpen(false);
      setSelectedAchievement(null);
    } else {
      toast({
        title: "Gagal",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const boundUpdateAchievement = updateAchievement.bind(
    null,
    selectedAchievement?.id || "",
    selectedAchievement?.imageUrl || null
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
            Kelola Prestasi
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Tambah, edit, atau hapus data prestasi siswa dan sekolah.
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Prestasi
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Prestasi Baru</DialogTitle>
            </DialogHeader>
            <AchievementForm
              action={createAchievement}
              onClose={() => {
                setAddOpen(false);
                getAchievements().then((data) => setAchievements(data as Achievement[]));
              }}
            />
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
                    <Image
                      src={item.imageUrl || "https://placehold.co/80x80.png"}
                      alt={item.title}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.student}</TableCell>
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
                            setSelectedAchievement(item);
                            setEditOpen(true);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            setSelectedAchievement(item);
                            setDeleteOpen(true);
                          }}
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
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
            <DialogTitle>Edit Prestasi</DialogTitle>
          </DialogHeader>
          {selectedAchievement && (
            <AchievementForm
              action={boundUpdateAchievement}
              initialData={selectedAchievement}
              onClose={() => {
                setEditOpen(false);
                setSelectedAchievement(null);
                getAchievements().then((data) => setAchievements(data as Achievement[]));
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data
              prestasi secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedAchievement(null)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
