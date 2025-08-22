
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


type OrgMember = {
  id: string;
  name: string;
  position: string;
  category: "Kepemimpinan Sekolah" | "Staf Tata Usaha" | "Pembina OSIS";
  initials: string;
  image: string;
};

const initialMembers: OrgMember[] = [
  { id: "1", name: "Dr. Budi Santoso, M.Pd.", position: "Kepala Sekolah", category: "Kepemimpinan Sekolah", initials: "BS", image: "https://placehold.co/150x150.png" },
  { id: "2", name: "Siti Rahayu, S.Pd.", position: "Wakil Kepala Sekolah Bidang Akademik", category: "Kepemimpinan Sekolah", initials: "SR", image: "https://placehold.co/150x150.png" },
  { id: "3", name: "Joko Susilo, S.Kom", position: "Kepala Tata Usaha", category: "Staf Tata Usaha", initials: "JS", image: "https://placehold.co/150x150.png" },
  { id: "4", name: "Eko Prasetyo, S.Or.", position: "Pembina OSIS", category: "Pembina OSIS", initials: "EP", image: "https://placehold.co/150x150.png" },
];

const categories = ["Kepemimpinan Sekolah", "Staf Tata Usaha", "Pembina OSIS"];

export default function OrganizationAdminPage() {
  const [members, setMembers] = useState<OrgMember[]>(initialMembers);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<OrgMember | null>(null);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  const handleAddMember = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const newMember: OrgMember = {
      id: Date.now().toString(),
      name,
      position: formData.get("position") as string,
      category: formData.get("category") as OrgMember['category'],
      initials: getInitials(name),
      image: "https://placehold.co/150x150.png",
    };
    setMembers([newMember, ...members]);
    setAddOpen(false);
    (event.target as HTMLFormElement).reset();
  };

  const handleEditMember = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedMember) return;
    
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const updatedMember: OrgMember = {
      ...selectedMember,
      name,
      position: formData.get("position") as string,
      category: formData.get("category") as OrgMember['category'],
      initials: getInitials(name),
    };

    setMembers(members.map(s => s.id === selectedMember.id ? updatedMember : s));
    setEditOpen(false);
    setSelectedMember(null);
  };
  
  const handleDeleteConfirm = () => {
    if (!selectedMember) return;
    setMembers(members.filter(s => s.id !== selectedMember.id));
    setDeleteOpen(false);
    setSelectedMember(null);
  };

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
            Kelola Struktur Organisasi
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Tambah, edit, atau hapus anggota dari struktur organisasi.
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Anggota
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Anggota Organisasi</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <Label htmlFor="image-add">Foto</Label>
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
              <div>
                <Label htmlFor="name-add">Nama Lengkap & Gelar</Label>
                <Input id="name-add" name="name" required />
              </div>
              <div>
                <Label htmlFor="position-add">Jabatan</Label>
                <Input id="position-add" name="position" required />
              </div>
              <div>
                <Label htmlFor="category-add">Kategori</Label>
                <Select name="category" required>
                    <SelectTrigger id="category-add">
                        <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                </Select>
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
                <TableHead className="w-[35%]">Nama</TableHead>
                <TableHead className="w-[30%]">Jabatan</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {members.map((item) => (
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
                    <TableCell>{item.position}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => { setSelectedMember(item); setEditOpen(true); }}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => { setSelectedMember(item); setDeleteOpen(true); }} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
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
              <DialogTitle>Edit Anggota Organisasi</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditMember} className="space-y-4">
               <div>
                <Label htmlFor="image-edit">Foto</Label>
                 <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                    <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                         <Label htmlFor="file-upload-edit" className="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none hover:text-primary/80">
                            <span>Ganti file</span>
                             <Input id="file-upload-edit" name="file-upload" type="file" className="sr-only" />
                        </Label>
                    </div>
                 </div>
              </div>
              <div>
                <Label htmlFor="name-edit">Nama Lengkap & Gelar</Label>
                <Input id="name-edit" name="name" defaultValue={selectedMember?.name} required />
              </div>
              <div>
                <Label htmlFor="position-edit">Jabatan</Label>
                <Input id="position-edit" name="position" defaultValue={selectedMember?.position} required />
              </div>
              <div>
                 <Label htmlFor="category-edit">Kategori</Label>
                <Select name="category" defaultValue={selectedMember?.category} required>
                    <SelectTrigger id="category-edit">
                        <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                </Select>
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
            <AlertDialogCancel onClick={() => setSelectedMember(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
