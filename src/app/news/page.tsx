
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const newsItems = [
  {
    id: "1",
    title: "Jadwal Ujian Akhir Semester (UAS) Genap",
    date: "2024-05-20",
    description: "Ujian Akhir Semester untuk tahun ajaran 2023/2024 akan dilaksanakan mulai tanggal 3 Juni hingga 7 Juni 2024. Harap siswa mempersiapkan diri.",
    image: "https://placehold.co/600x400.png",
    hint: "students exam",
    link: "#"
  },
  {
    id: "2",
    title: "Pendaftaran Ekstrakurikuler Tahun Ajaran Baru",
    date: "2024-05-18",
    description: "Pendaftaran untuk seluruh kegiatan ekstrakurikuler tahun ajaran 2024/2025 akan dibuka pada tanggal 15 Juli 2024.",
    image: "https://placehold.co/600x400.png",
    hint: "student activities",
    link: "#"
  },
  {
    id: "3",
    title: "Informasi Libur Kenaikan Kelas",
    date: "2024-05-15",
    description: "Libur akhir tahun ajaran akan dimulai pada tanggal 10 Juni 2024 dan siswa akan kembali masuk pada tanggal 8 Juli 2024.",
    image: "https://placehold.co/600x400.png",
    hint: "school holiday",
    link: "#"
  },
   {
    id: "4",
    title: "Community Service Day",
    date: "2024-02-20",
    description: "Students participated in various community service activities, making a positive impact on the local environment.",
    image: "https://placehold.co/600x400.png",
    hint: "community service",
    link: "#"
  },
  {
    id: "5",
    title: "New School Library Opening",
    date: "2024-02-15",
    description: "We are excited to announce the opening of our new state-of-the-art library, a hub for learning and discovery.",
    image: "https://placehold.co/600x400.png",
    hint: "school library",
    link: "#"
  },
    {
    id: "6",
    title: "Parent-Teacher Conference",
    date: "2024-02-10",
    description: "A successful parent-teacher conference was held to discuss student progress and collaboration.",
    image: "https://placehold.co/600x400.png",
    hint: "teacher meeting",
    link: "#"
  },
];

export default function NewsPage() {
  const sortedNews = newsItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
        {sortedNews.map((item) => (
          <Card key={item.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-xl">
            <CardHeader className="p-0">
              <Image
                src={item.image}
                alt={item.title}
                width={600}
                height={400}
                className="h-56 w-full object-cover"
                data-ai-hint={item.hint}
              />
            </CardHeader>
            <CardContent className="flex flex-col p-6">
              <p className="mb-2 text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <CardTitle className="font-headline text-xl font-bold text-primary">
                {item.title}
              </CardTitle>
              <p className="mt-2 flex-grow text-foreground/80">{item.description}</p>
              <Button variant="link" asChild className="mt-4 p-0 self-start text-accent-foreground">
                <Link href={item.link}>
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
