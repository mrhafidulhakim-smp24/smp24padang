
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BookMarked, Building } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

const initialData = {
  curriculum: {
    title: "Kurikulum Merdeka yang Adaptif & Inovatif",
    content: [
      "SMPN 24 Padang menerapkan **Kurikulum Merdeka**, sebuah pendekatan pendidikan yang memberikan keleluasaan bagi guru untuk menciptakan pembelajaran berkualitas yang sesuai dengan kebutuhan dan minat belajar siswa. Kurikulum ini dirancang untuk menumbuhkan siswa yang kreatif, mandiri, dan bernalar kritis.",
      "Kami fokus pada pembelajaran intrakurikuler yang beragam, di mana konten dioptimalkan agar siswa memiliki cukup waktu untuk mendalami konsep dan menguatkan kompetensi. Selain itu, kami mengintegrasikan **Projek Penguatan Profil Pelajar Pancasila (P5)** yang memungkinkan siswa untuk mengeksplorasi isu-isu aktual seperti lingkungan, kesehatan, dan kewirausahaan melalui pembelajaran berbasis proyek yang kolaboratif."
    ],
    image: "https://placehold.co/1200x400.png",
    hint: "library books",
  },
  learningStructure: {
    title: "Struktur Pembelajaran yang Mendukung",
    content: [
        "Struktur pembelajaran kami dirancang untuk menciptakan lingkungan belajar yang kondusif dan terarah bagi siswa jenjang Sekolah Menengah Pertama (Kelas 7-9). Setiap kelas dibimbing oleh seorang wali kelas yang berdedikasi, yang berperan sebagai fasilitator utama dan jembatan komunikasi antara sekolah, siswa, dan orang tua.",
        "Wali kelas bekerja sama dengan tim guru mata pelajaran yang ahli di bidangnya untuk memastikan setiap siswa mendapatkan perhatian yang dibutuhkan, baik secara akademik maupun personal. Pendekatan ini memungkinkan kami untuk memantau perkembangan siswa secara holistik dan memberikan dukungan yang tepat waktu untuk membantu mereka mencapai potensi maksimal."
    ],
    image: "https://placehold.co/1200x400.png",
    hint: "school building"
  }
};

export default function AcademicsAdminPage() {
    const [curriculum, setCurriculum] = useState(initialData.curriculum);
    const [learningStructure, setLearningStructure] = useState(initialData.learningStructure);
    const { toast } = useToast();

    const handleSaveChanges = () => {
        console.log("Saving changes:", { curriculum, learningStructure });
        toast({
            title: "Perubahan Disimpan!",
            description: "Informasi akademik telah berhasil diperbarui.",
        });
    };

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                    Kelola Informasi Akademik
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Perbarui konten untuk halaman Kurikulum dan Struktur Pembelajaran.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookMarked className="h-6 w-6 text-accent"/>
                            <span>Kurikulum</span>
                        </CardTitle>
                        <CardDescription>
                            Edit judul, deskripsi, dan gambar untuk bagian kurikulum.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="curriculum-title">Judul</Label>
                            <Input id="curriculum-title" value={curriculum.title} onChange={(e) => setCurriculum({...curriculum, title: e.target.value})} />
                        </div>
                        <div>
                            <Label htmlFor="curriculum-content">Deskripsi</Label>
                            <Textarea id="curriculum-content" value={curriculum.content.join("\n\n")} onChange={(e) => setCurriculum({...curriculum, content: e.target.value.split("\n\n")})} className="min-h-[150px]"/>
                            <p className="text-xs text-muted-foreground mt-1">Pisahkan paragraf dengan dua kali enter.</p>
                        </div>
                         <div>
                            <Label>Gambar</Label>
                            <Image src={curriculum.image} alt="Pratinjau Kurikulum" width={1200} height={400} className="w-full rounded-md object-cover aspect-[3/1] my-2" />
                            <Input type="file" />
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="h-6 w-6 text-accent"/>
                            <span>Struktur Pembelajaran</span>
                        </CardTitle>
                        <CardDescription>
                            Edit judul, deskripsi, dan gambar untuk bagian struktur pembelajaran.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="structure-title">Judul</Label>
                            <Input id="structure-title" value={learningStructure.title} onChange={(e) => setLearningStructure({...learningStructure, title: e.target.value})} />
                        </div>
                        <div>
                            <Label htmlFor="structure-content">Deskripsi</Label>
                            <Textarea id="structure-content" value={learningStructure.content.join("\n\n")} onChange={(e) => setLearningStructure({...learningStructure, content: e.target.value.split("\n\n")})} className="min-h-[150px]"/>
                             <p className="text-xs text-muted-foreground mt-1">Pisahkan paragraf dengan dua kali enter.</p>
                        </div>
                         <div>
                            <Label>Gambar</Label>
                            <Image src={learningStructure.image} alt="Pratinjau Struktur Pembelajaran" width={1200} height={400} className="w-full rounded-md object-cover aspect-[3/1] my-2" />
                            <Input type="file" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={handleSaveChanges} size="lg">Simpan Semua Perubahan</Button>
            </div>
        </div>
    );
}
