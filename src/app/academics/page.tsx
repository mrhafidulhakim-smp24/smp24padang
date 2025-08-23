
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, BookMarked, Activity } from "lucide-react";
import Image from "next/image";

export default function AcademicsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          Informasi Akademik
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Menumbuhkan Keunggulan Intelektual dan Semangat Belajar Seumur Hidup.
        </p>
      </div>

      <Tabs defaultValue="curriculum" className="mt-12 w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
          <TabsTrigger value="curriculum">
            <BookMarked className="mr-2 h-5 w-5" /> Kurikulum
          </TabsTrigger>
          <TabsTrigger value="organization">
            <Building className="mr-2 h-5 w-5" /> Struktur Pembelajaran
          </TabsTrigger>
        </TabsList>
        <TabsContent value="curriculum" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">
                Kurikulum Merdeka yang Adaptif & Inovatif
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/80">
               <Image src="https://placehold.co/1200x400.png" alt="Curriculum" width={1200} height={400} className="mb-6 w-full rounded-lg object-cover" data-ai-hint="library books" />
              <p>
                SMPN 24 Padang menerapkan **Kurikulum Merdeka**, sebuah pendekatan pendidikan yang memberikan keleluasaan bagi guru untuk menciptakan pembelajaran berkualitas yang sesuai dengan kebutuhan dan minat belajar siswa. Kurikulum ini dirancang untuk menumbuhkan siswa yang kreatif, mandiri, dan bernalar kritis.
              </p>
              <p>
                Kami fokus pada pembelajaran intrakurikuler yang beragam, di mana konten dioptimalkan agar siswa memiliki cukup waktu untuk mendalami konsep dan menguatkan kompetensi. Selain itu, kami mengintegrasikan **Projek Penguatan Profil Pelajar Pancasila (P5)** yang memungkinkan siswa untuk mengeksplorasi isu-isu aktual seperti lingkungan, kesehatan, dan kewirausahaan melalui pembelajaran berbasis proyek yang kolaboratif.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="organization" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">
                Struktur Pembelajaran yang Mendukung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/80">
              <Image src="https://placehold.co/1200x400.png" alt="Organization" width={1200} height={400} className="mb-6 w-full rounded-lg object-cover" data-ai-hint="school building" />
              <p>
                Struktur pembelajaran kami dirancang untuk menciptakan lingkungan belajar yang kondusif dan terarah bagi siswa jenjang Sekolah Menengah Pertama (Kelas 7-9). Setiap kelas dibimbing oleh seorang wali kelas yang berdedikasi, yang berperan sebagai fasilitator utama dan jembatan komunikasi antara sekolah, siswa, dan orang tua.
              </p>
              <p>
                Wali kelas bekerja sama dengan tim guru mata pelajaran yang ahli di bidangnya untuk memastikan setiap siswa mendapatkan perhatian yang dibutuhkan, baik secara akademik maupun personal. Pendekatan ini memungkinkan kami untuk memantau perkembangan siswa secara holistik dan memberikan dukungan yang tepat waktu untuk membantu mereka mencapai potensi maksimal.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
