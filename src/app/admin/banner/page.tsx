
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

type Banner = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

const initialBanners: Banner[] = [
  { id: '1', title: 'Selamat Datang di SMPN 24 Padang', description: 'Sekolah unggul yang berdedikasi untuk membentuk generasi masa depan yang cerdas, kreatif, dan berkarakter.', imageUrl: 'https://placehold.co/1920x1080.png' },
  { id: '2', title: 'Penerimaan Siswa Baru 2024/2025', description: 'Bergabunglah dengan komunitas kami dan mulailah perjalanan pendidikan Anda.', imageUrl: 'https://placehold.co/1920x1080.png' },
];

export default function BannerAdminPage() {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
            Kelola Banner Beranda
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Tambah, edit, atau hapus banner yang tampil di halaman utama.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Banner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Banner Baru</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div>
                <Label htmlFor="title-add">Judul Banner</Label>
                <Input id="title-add" name="title" required />
              </div>
              <div>
                <Label htmlFor="description-add">Deskripsi Singkat</Label>
                <Textarea id="description-add" name="description" required />
              </div>
              <div>
                <Label htmlFor="image-add">Gambar</Label>
                <Input id="image-add" name="image" type="file" />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Simpan</Button>
              </div>
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
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={120}
                      height={67}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="text-center text-sm text-muted-foreground">
        <p>Manajemen Banner dinonaktifkan sementara. Data yang ditampilkan adalah data statis.</p>
      </div>
    </div>
  );
}
