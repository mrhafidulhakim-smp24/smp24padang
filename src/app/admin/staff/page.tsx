
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
import { PlusCircle, MoreHorizontal, Trash2, Pencil, Upload, Users, UserCheck, UserCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type StaffMember = {
  id: string;
  name: string;
  position: string;
  subject: string;
  waliKelas?: string;
  initials: string;
  image: string;
  hint: string;
};

const initialStaff: StaffMember[] = [
  { id: "1", name: "Dr. Budi Santoso, M.Pd.", position: "Kepala Sekolah", subject: "Manajemen Pendidikan", initials: "BS", image: "https://placehold.co/150x150.png", hint: "man portrait" },
  { id: "2", name: "Siti Rahayu, S.Pd.", position: "Guru", subject: "Bahasa Indonesia", waliKelas: "Kelas 9A", initials: "SR", image: "https://placehold.co/150x150.png", hint: "woman portrait" },
  { id: "3", name: "Agus Wijaya, S.Si.", position: "Guru", subject: "Sains", waliKelas: "Kelas 8B", initials: "AW", image: "https://placehold.co/150x150.png", hint: "man portrait" },
  { id: "4", name: "Rina Marlina", position: "Staf Administrasi", subject: "Tata Usaha", initials: "RM", image: "https://placehold.co/150x150.png", hint: "woman portrait" },
];

export default function StaffAdminPage() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const stats = useMemo(() => {
    const totalStaff = staff.length;
    const totalTeachers = staff.filter(s => s.position.toLowerCase().includes('guru') || s.position.toLowerCase().includes('kepala sekolah')).length;
    const totalAdmin = totalStaff - totalTeachers;
    return { totalStaff, totalTeachers, totalAdmin };
  }, [staff]);

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
      position: formData.get("position") as string,
      subject: formData.get("subject") as string,
      waliKelas: formData.get("waliKelas") as string || undefined,
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
      position: formData.get("position") as string,
      subject: formData.get("subject") as string,
      waliKelas: formData.get("waliKelas") as string || undefined,
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
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Anggota Baru</DialogTitle>
              <DialogDescription>
                Isi detail untuk menambahkan guru atau staf baru.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <Label htmlFor="image-add">Foto</Label>
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
                <Label htmlFor="name-add">Nama Lengkap & Gelar</Label>
                <Input id="name-add" name="name" placeholder="Contoh: Dr. Budi Santoso, M.Pd." required />
              </div>
              <div>
                <Label htmlFor="position-add">Jabatan</Label>
                <Input id="position-add" name="position" placeholder="Contoh: Guru / Staf Administrasi" required />
              </div>
              <div>
                <Label htmlFor="subject-add">Mata Pelajaran / Bidang</Label>
                <Input id="subject-add" name="subject" placeholder="Contoh: Matematika / Tata Usaha" />
              </div>
              <div>
                <Label htmlFor="waliKelas-add">Wali Kelas (Opsional)</Label>
                <Input id="waliKelas-add" name="waliKelas" placeholder="Contoh: Kelas 7A" />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Batal</Button>
                <Button type="submit">Simpan</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
            <main className="lg:col-span-2">
                <Card>
                    <CardContent className="p-0">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[30%]">Nama</TableHead>
                            <TableHead>Jabatan</TableHead>
                            <TableHead>Bidang</TableHead>
                            <TableHead>Wali Kelas</TableHead>
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
                                <TableCell>{item.position}</TableCell>
                                <TableCell>{item.subject}</TableCell>
                                <TableCell>{item.waliKelas || "-"}</TableCell>
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
            </main>

            <aside className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Statistik Staf</CardTitle>
                        <CardDescription>Ringkasan jumlah guru dan staf di sekolah.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="h-5 w-5"/>
                                <span>Total Staf</span>
                            </div>
                            <span className="font-bold text-lg">{stats.totalStaff}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <UserCheck className="h-5 w-5"/>
                                <span>Jumlah Guru</span>
                            </div>
                            <span className="font-bold text-lg">{stats.totalTeachers}</span>
                        </div>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <UserCog className="h-5 w-5"/>
                                <span>Staf Administrasi</span>
                            </div>
                            <span className="font-bold text-lg">{stats.totalAdmin}</span>
                        </div>
                    </CardContent>
                </Card>
            </aside>
        </div>


       <Dialog open={isEditOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Anggota</DialogTitle>
              <DialogDescription>
                Perbarui detail guru atau staf di bawah ini.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditStaff} className="space-y-4">
               <div>
                <Label htmlFor="image-edit">Foto</Label>
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
                <Label htmlFor="name-edit">Nama Lengkap & Gelar</Label>
                <Input id="name-edit" name="name" defaultValue={selectedStaff?.name} required />
              </div>
              <div>
                <Label htmlFor="position-edit">Jabatan</Label>
                <Input id="position-edit" name="position" defaultValue={selectedStaff?.position} required />
              </div>
              <div>
                <Label htmlFor="subject-edit">Mata Pelajaran</Label>
                <Input id="subject-edit" name="subject" defaultValue={selectedStaff?.subject} />
              </div>
               <div>
                <Label htmlFor="waliKelas-edit">Wali Kelas (Opsional)</Label>
                <Input id="waliKelas-edit" name="waliKelas" defaultValue={selectedStaff?.waliKelas} placeholder="Contoh: Kelas 7A" />
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
