
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const initialStats = {
  classrooms: 24,
  students: 773,
  teachers: 30,
  staff: 12,
};

export default function StatisticsAdminPage() {
  const [stats, setStats] = useState(initialStats);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStats(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving statistics:", stats);
    toast({
      title: "Sukses!",
      description: "Data statistik berhasil diperbarui (mode simulasi).",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
          Kelola Statistik Sekolah
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Perbarui data statistik yang ditampilkan di halaman beranda.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Utama</CardTitle>
          <CardDescription>Masukkan angka numerik untuk setiap bidang.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="classrooms">Jumlah Ruang Kelas</Label>
              <Input
                id="classrooms"
                name="classrooms"
                type="number"
                value={stats.classrooms}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="students">Jumlah Siswa</Label>
              <Input
                id="students"
                name="students"
                type="number"
                value={stats.students}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teachers">Jumlah Pendidik</Label>
              <Input
                id="teachers"
                name="teachers"
                type="number"
                value={stats.teachers}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff">Jumlah Tenaga Kependidikan</Label>
              <Input
                id="staff"
                name="staff"
                type="number"
                value={stats.staff}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}
