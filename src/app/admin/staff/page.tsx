
"use client";

import { useState, useEffect, type FormEvent, useActionState } from "react";
import Image from "next/image";
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  createStaff,
  updateStaff,
  deleteStaff,
  getStaff,
} from "./actions";
import { type Staff } from "@prisma/client";

function StaffForm({
  action,
  initialData,
  onClose,
}: {
  action: (state: { success: boolean; message: string; }, formData: FormData) => Promise<{ success: boolean; message: string; }>;
  initialData?: Staff | null;
  onClose: () => void;
}) {
  const [state, formAction] = useActionState(action, {
    success: false,
    message: "",
  });
  const { toast } = useToast();
  const [preview, setPreview] = useState(initialData?.imageUrl || null);

  useEffect(() => {
    if (state.success) {
      toast({ title: "Sukses!", description: state.message || "Aksi berhasil diselesaikan." });
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
        <Label>Foto</Label>
        <div className="mt-1 flex items-center gap-4">
          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
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
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input
          id="name"
          name="name"
          defaultValue={initialData?.name}
          required
        />
      </div>
      <div>
        <Label htmlFor="position">Jabatan</Label>
        <Input
          id="position"
          name="position"
          defaultValue={initialData?.position}
          required
        />
      </div>
      <div>
        <Label htmlFor="subject">Mata Pelajaran / Bidang</Label>
        <Input
          id="subject"
          name="subject"
          defaultValue={initialData?.subject || ""}
        />
      </div>
       <div>
        <Label htmlFor="homeroomOf">Wali Kelas (Opsional)</Label>
        <Input
          id="homeroomOf"
          name="homeroomOf"
          placeholder="Contoh: Kelas 9A"
          defaultValue={initialData?.homeroomOf || ""}
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

export default function StaffAdminPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] =
    useState<Staff | null>(null);

  useEffect(() => {
    getStaff().then(setStaff);
  }, []);
  
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!selectedStaff) return;
    const result = await deleteStaff(
      selectedStaff.id,
      selectedStaff.imageUrl
    );
    if (result.success) {
      toast({ title: "Sukses!", description: result.message });
      setStaff(staff.filter((a) => a.id !== selectedStaff.id));
      setDeleteOpen(false);
      setSelectedStaff(null);
    } else {
      toast({
        title: "Gagal",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const boundUpdateStaff = updateStaff.bind(
    null,
    selectedStaff?.id || "",
    selectedStaff?.imageUrl || null
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
            Kelola Guru & Staf
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Tambah, edit, atau hapus data guru dan staf sekolah.
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Staf
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Staf Baru</DialogTitle>
            </DialogHeader>
            <StaffForm
              action={createStaff}
              onClose={() => {
                setAddOpen(false);
                getStaff().then(setStaff);
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
                <TableHead>Foto</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Bidang</TableHead>
                <TableHead>Wali Kelas</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Image
                      src={item.imageUrl || "https://placehold.co/80x80.png"}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.position}</TableCell>
                  <TableCell>{item.subject}</TableCell>
                  <TableCell>{item.homeroomOf || '-'}</TableCell>
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
                            setSelectedStaff(item);
                            setEditOpen(true);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            setSelectedStaff(item);
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
            <DialogTitle>Edit Data Staf</DialogTitle>
          </DialogHeader>
          {selectedStaff && (
            <StaffForm
              action={boundUpdateStaff}
              initialData={selectedStaff}
              onClose={() => {
                setEditOpen(false);
                setSelectedStaff(null);
                getStaff().then(setStaff);
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
              staf secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedStaff(null)}>
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
