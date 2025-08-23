
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const newsItems = [
    { id: "1", date: new Date(), title: "Juara 1 Lomba Cerdas Cermat Tingkat Kota", description: "Tim cerdas cermat SMPN 24 Padang berhasil meraih Juara 1 dalam kompetisi tingkat kota, menunjukkan keunggulan akademik yang membanggakan.", imageUrl: "https://placehold.co/600x400.png", hint: "students winning trophy" },
    { id: "2", date: new Date(), title: "Kegiatan Jumat Bersih dan Sehat", description: "Seluruh warga sekolah berpartisipasi dalam kegiatan Jumat Bersih untuk menciptakan lingkungan belajar yang nyaman dan asri.", imageUrl: "https://placehold.co/600x400.png", hint: "students cleaning school" },
    { id: "3", date: new Date(), title: "Peringatan Hari Kemerdekaan RI ke-79", description: "Upacara bendera dan berbagai lomba meriahkan peringatan HUT RI ke-79 di SMPN 24 Padang, menumbuhkan semangat nasionalisme.", imageUrl: "https://placehold.co/600x400.png", hint: "flag ceremony" },
    { id: "4", date: new Date(), title: "Studi Tur Edukatif ke Museum Adityawarman", description: "Siswa kelas 8 melakukan studi tur ke Museum Adityawarman untuk mempelajari sejarah dan budaya Minangkabau secara langsung.", imageUrl: "https://placehold.co/600x400.png", hint: "students in museum" },
    { id: "5", date: new Date(), title: "Pelatihan Kepemimpinan untuk Pengurus OSIS", description: "Pengurus OSIS periode baru mengikuti pelatihan kepemimpinan untuk meningkatkan kapasitas organisasi dan manajerial.", imageUrl: "https://placehold.co/600x400.png", hint: "leadership training" },
    { id: "6", date: new Date(), title: "Pameran Karya Seni Siswa di Akhir Semester", description: "Kreativitas siswa dipamerkan dalam pameran seni rupa yang menampilkan lukisan, patung, dan kerajinan tangan.", imageUrl: "https://placehold.co/600x400.png", hint: "student art exhibition" },
];


export default async function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          Berita & Pengumuman
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Ikuti terus berita, acara, dan pengumuman terbaru dari SMPN 24 Padang.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {newsItems.map((item) => (
          <Card key={item.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-xl flex flex-col">
            <CardHeader className="p-0">
               <Link href={`/news/${item.id}`}>
                <Image
                  src={item.imageUrl || "https://placehold.co/600x400.png"}
                  alt={item.title}
                  width={600}
                  height={400}
                  className="h-56 w-full object-cover"
                  data-ai-hint={item.hint || "news article"}
                />
              </Link>
            </CardHeader>
            <CardContent className="flex flex-grow flex-col p-6">
              <p className="mb-2 text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <CardTitle className="font-headline text-xl font-bold text-primary">
                 <Link href={`/news/${item.id}`} className="hover:underline">{item.title}</Link>
              </CardTitle>
              <p className="mt-2 flex-grow text-foreground/80 dark:text-foreground/70">{item.description.substring(0, 100)}...</p>
              <Button variant="link" asChild className="mt-4 p-0 self-start text-accent hover:text-accent/80">
                <Link href={`/news/${item.id}`}>
                  Baca Lebih Lanjut <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
