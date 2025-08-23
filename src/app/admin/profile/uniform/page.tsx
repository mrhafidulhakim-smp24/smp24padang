
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";

type Uniform = {
  id: string;
  day: string;
  description: string;
  image: string;
  hint: string;
};

const initialUniforms: Uniform[] = [
  { id: "1", day: "Senin", description: "Seragam Putih Biru lengkap.", image: "https://placehold.co/400x600.png", hint: "school uniform blue" },
  { id: "2", day: "Selasa", description: "Seragam Putih Biru lengkap.", image: "https://placehold.co/400x600.png", hint: "school uniform blue" },
  { id: "3", day: "Rabu", description: "Seragam Batik identitas sekolah.", image: "https://placehold.co/400x600.png", hint: "batik uniform" },
  { id: "4", day: "Kamis", description: "Seragam Batik identitas sekolah.", image: "https://placehold.co/400x600.png", hint: "batik uniform" },
  { id: "5", day: "Jumat", description: "Seragam Pramuka lengkap.", image: "https://placehold.co/400x600.png", hint: "scout uniform" },
  { id: "6", day: "Olahraga", description: "Digunakan saat pelajaran Olahraga.", image: "https://placehold.co/400x600.png", hint: "sport uniform" },
];

export default function UniformAdminPage() {
  const [uniforms, setUniforms] = useState<Uniform[]>(initialUniforms);
  const [isEditOpen, setEditOpen] = useState(false);
  const [selectedUniform, setSelectedUniform] = useState<Uniform | null>(null);

  const handleEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedUniform) return;
    
    const formData = new FormData(event.currentTarget);
    const updatedUniform: Uniform = {
      ...selectedUniform,
      description: formData.get("description") as string,
    };

    setUniforms(uniforms.map(u => u.id === selectedUniform.id ? updatedUniform : u));
    setEditOpen(false);
    setSelectedUniform(null);
  };

  return (
    <div className="flex flex-col gap-8">
       <div>
          <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
            Kelola Seragam Sekolah
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Perbarui gambar dan deskripsi untuk setiap seragam.
          </p>
        </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {uniforms.map((uniform) => (
          <Card key={uniform.id} className="group relative overflow-hidden">
            <CardHeader className="p-0">
                <Image
                  src={uniform.image}
                  alt={uniform.day}
                  width={400}
                  height={600}
                  className="aspect-[4/6] w-full object-cover"
                />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="font-headline text-xl text-primary">{uniform.day}</CardTitle>
              <CardDescription>{uniform.description}</CardDescription>
            </CardContent>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedUniform(uniform);
                  setEditOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>

       <Dialog open={isEditOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Seragam: {selectedUniform?.day}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <Label>Ganti Gambar</Label>
                 <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                    <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                         <Label htmlFor="file-upload-edit" className="relative cursor-pointer rounded-md bg-white font-medium text-primary focus-within:outline-none hover:text-primary/80">
                           <span>Unggah file baru</span>
                           <Input id="file-upload-edit" type="file" className="sr-only" />
                        </Label>
                    </div>
                 </div>
              </div>
              <div>
                <Label htmlFor="description-edit">Deskripsi</Label>
                <Input id="description-edit" name="description" defaultValue={selectedUniform?.description} required />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                 <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Batal</Button>
                 <Button type="submit">Simpan Perubahan</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
    </div>
  );
}
