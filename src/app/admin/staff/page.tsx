
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
import { PlusCircle, MoreHorizontal, Trash2, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type StaffMember = {
  id: string;
  name: string;
  role: string;
  initials: string;
  image: string;
  hint: string;
};

const initialStaff: StaffMember[] = [
  { id: "1", name: "Dr. Budi Santoso", role: "Kepala Sekolah", initials: "BS", image: "https://placehold.co/150x150.png", hint: "man portrait" },
  { id: "2", name: "Siti Rahayu", role: "Kepala Akademik", initials: "SR", image: "https://placehold.co/150x150.png", hint: "woman portrait" },
  { id: "3", name: "Agus Wijaya", role: "Kepala Departemen Sains", initials: "AW", image: "https://placehold.co/150x150.png", hint: "man portrait" },
];

export default function StaffAdminPage() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  const handleAddStaff = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const newStaffMember: StaffMember = {
      id: Date.now().toString(),
      name,
      role: formData.get("role") as string,
      initials: getInitials(name),
      image: "https://placehold.co/150x150.png",
      hint: "portrait"
    };
    setStaff([newStaffMember, ...staff]);
    setAddOpen(false);
  };

  const handleEditStaff = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedStaff) return;
    
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const updatedStaffMember: StaffMember = {
      ...selectedStaff,
      name,
      role: formData.get("role") as string,
      initials: getInitials(name),
    };

    setStaff(staff.map(s => s.id === selectedStaff.id ? updatedStaffMember : s));
    setEditOpen(false);
    setSelectedStaff(null);
  };
  
  const handleDeleteConfirm = () => {
    if (!selectedStaff) return;
    setStaff(staff.filter(s => s.id !== selectedStaff.id));
    setDeleteOpen(false);
    setSelectedStaff(null);
  };

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
            Kelola Guru & Staf
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Tambah, edit, atau hapus data guru dan staf.
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Anggota
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Anggota Baru</DialogTitle>
              <DialogDescription>
                Isi detail untuk menambahkan guru atau staf baru.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="role">Jabatan</Label>
                <Input id="role" name="role" required />
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
                <TableHead>Nama</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {staff.map((item) => (
                <TableRow key={item.id}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={item.image} alt={item.name} />
                                <AvatarFallback>{item.initials}</AvatarFallback>
                            </Avatar>
                            <span>{item.name}</span>
                        </div>
                    </TableCell>
                    <TableCell>{item.role}</TableCell>
                    <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => { setSelectedStaff(item); setEditOpen(true); }}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => { setSelectedStaff(item); setDeleteOpen(true); }} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
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
              <DialogTitle>Edit Anggota</DialogTitle>
              <DialogDescription>
                Perbarui detail guru atau staf di bawah ini.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditStaff} className="space-y-4">
              <div>
                <Label htmlFor="name-edit">Nama Lengkap</Label>
                <Input id="name-edit" name="name" defaultValue={selectedStaff?.name} required />
              </div>
              <div>
                <Label htmlFor="role-edit">Jabatan</Label>
                <Input id="role-edit" name="role" defaultValue={selectedStaff?.role} required />
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
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data anggota secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedStaff(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
