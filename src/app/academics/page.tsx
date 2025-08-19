import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, BookMarked, Activity } from "lucide-react";
import Image from "next/image";

export default function AcademicsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          Akademik Kami
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Menumbuhkan rasa ingin tahu intelektual dan semangat untuk belajar seumur hidup.
        </p>
      </div>

      <Tabs defaultValue="curriculum" className="mt-12 w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="curriculum">
            <BookMarked className="mr-2 h-5 w-5" /> Kurikulum
          </TabsTrigger>
          <TabsTrigger value="organization">
            <Building className="mr-2 h-5 w-5" /> Organisasi
          </TabsTrigger>
          <TabsTrigger value="activities">
            <Activity className="mr-2 h-5 w-5" /> Kegiatan
          </TabsTrigger>
        </TabsList>
        <TabsContent value="curriculum" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">
                Kurikulum Komprehensif
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/80">
               <Image src="https://placehold.co/1200x400.png" alt="Curriculum" width={1200} height={400} className="mb-6 w-full rounded-lg object-cover" data-ai-hint="library books" />
              <p>
                Kurikulum kami dirancang untuk memberikan pendidikan yang seimbang dan holistik, memadukan standar akademik yang ketat dengan pengalaman belajar yang kreatif dan praktis. Kami mengikuti kurikulum nasional sambil menggabungkan metodologi pengajaran inovatif untuk melayani gaya belajar yang beragam.
              </p>
              <p>
                Mata pelajaran inti meliputi Matematika, Sains, Bahasa, dan Ilmu Sosial, dilengkapi dengan berbagai pilihan mata pelajaran dalam seni, teknologi, dan pendidikan jasmani. Kami menekankan pemikiran kritis, pemecahan masalah, dan kolaborasi untuk mempersiapkan siswa menghadapi tantangan masa depan.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="organization" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">
                Organisasi Sekolah
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/80">
              <Image src="https://placehold.co/1200x400.png" alt="Organization" width={1200} height={400} className="mb-6 w-full rounded-lg object-cover" data-ai-hint="school building" />
              <p>
                SMPN 24 Padang terstruktur untuk menciptakan lingkungan belajar yang mendukung dan efisien. Sekolah ini dibagi menjadi tiga tingkatan utama: Sekolah Dasar (Kelas 1-6), Sekolah Menengah Pertama (Kelas 7-9), dan Sekolah Menengah Atas (Kelas 10-12).
              </p>
              <p>
                Setiap tingkatan dipimpin oleh seorang kepala yang berdedikasi, yang bekerja sama dengan tim pendidik dan staf pendukung yang berpengalaman. Badan administrasi kami memastikan kelancaran semua fungsi sekolah, mulai dari penerimaan siswa hingga kesejahteraan siswa, menjaga komunikasi terbuka dengan orang tua dan masyarakat luas.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activities" id="activities" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">
                Kegiatan Ekstrakurikuler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/80">
              <Image src="https://placehold.co/1200x400.png" alt="Activities" width={1200} height={400} className="mb-6 w-full rounded-lg object-cover" data-ai-hint="students playing" />
              <p>
                Kami percaya bahwa belajar tidak hanya terbatas di dalam kelas. Program ekstrakurikuler kami yang beragam memberikan siswa kesempatan untuk mengeksplorasi minat mereka, mengembangkan keterampilan baru, dan membangun karakter.
              </p>
              <p>
                Siswa dapat memilih dari berbagai klub dan kegiatan, termasuk:
              </p>
              <ul className="list-disc pl-6">
                <li><strong>Olahraga:</strong> Sepak Bola, Bola Basket, Renang, dan Atletik.</li>
                <li><strong>Seni:</strong> Klub Drama, Paduan Suara Sekolah, Band, dan Seni Rupa.</li>
                <li><strong>Klub Akademik:</strong> Tim Debat, Klub Sains, dan Olimpiade Matematika.</li>
                <li><strong>Pengabdian Masyarakat:</strong> Program sukarela dan penjangkauan sosial.</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
