
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const newsItems = [
    { id: '1', title: 'Kegiatan Class Meeting Akhir Semester', date: new Date(), description: 'Siswa-siswi menunjukkan bakat dan sportivitas dalam berbagai perlombaan seru seperti futsal, basket, dan tarik tambang untuk merayakan akhir semester.', imageUrl: 'https://placehold.co/600x400.png', hint: 'students competition' },
    { id: '2', title: 'Workshop Guru Inovatif', date: new Date(), description: 'Para guru mengikuti pelatihan intensif mengenai metode pengajaran terbaru dan pemanfaatan teknologi dalam pendidikan untuk meningkatkan kualitas pembelajaran di kelas.', imageUrl: 'https://placehold.co/600x400.png', hint: 'teacher workshop' },
    { id: '3', title: 'Peringatan Hari Lingkungan Hidup', date: new Date(), description: 'Seluruh warga sekolah berpartisipasi dalam aksi bersih-bersih lingkungan sekolah dan menanam pohon sebagai bentuk kepedulian terhadap bumi.', imageUrl: 'https://placehold.co/600x400.png', hint: 'environmental cleanup' },
    { id: '4', title: 'Kunjungan Edukatif ke Museum Adityawarman', date: new Date(), description: 'Siswa kelas 8 melakukan kunjungan belajar ke museum untuk mempelajari sejarah dan budaya Minangkabau secara langsung.', imageUrl: 'https://placehold.co/600x400.png', hint: 'museum visit' },
];


export default function NewsPage() {
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
              <p className="mt-2 flex-grow text-foreground/80">{item.description.substring(0, 100)}...</p>
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
