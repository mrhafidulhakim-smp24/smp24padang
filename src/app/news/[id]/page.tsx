
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, UserCircle } from "lucide-react";

const mockNews = [
    { id: '1', title: 'Lomba Cerdas Cermat Tingkat Kota', description: 'Siswa kami berhasil meraih juara 2 dalam Lomba Cerdas Cermat tingkat kota Padang. Prestasi ini merupakan buah dari kerja keras dan bimbingan para guru.\n\nKegiatan ini diikuti oleh puluhan sekolah dari seluruh penjuru kota, menunjukkan persaingan yang ketat dan semangat sportivitas yang tinggi.', date: new Date('2023-11-15'), imageUrl: 'https://placehold.co/1200x675.png' },
    { id: '2', title: 'Kegiatan Jumat Bersih Lingkungan Sekolah', description: 'Dalam rangka menumbuhkan kepedulian terhadap lingkungan, kami mengadakan kegiatan Jumat Bersih yang diikuti oleh seluruh siswa dan guru. Para siswa dengan antusias membersihkan area kelas, halaman, dan taman sekolah.', date: new Date('2023-11-10'), imageUrl: 'https://placehold.co/1200x675.png' },
    { id: '3', title: 'Peringatan Hari Pahlawan 10 November', description: 'Upacara bendera dan berbagai lomba diadakan untuk memperingati jasa para pahlawan yang telah berjuang untuk kemerdekaan Indonesia. Kegiatan ini bertujuan untuk menanamkan jiwa nasionalisme kepada para siswa.', date: new Date('2023-11-08'), imageUrl: 'https://placehold.co/1200x675.png' },
    { id: '4', title: 'Studi Tur ke Museum Adityawarman', description: 'Siswa kelas 8 melakukan studi tur edukatif untuk mempelajari sejarah dan budaya Minangkabau secara langsung. Mereka sangat antusias melihat koleksi peninggalan sejarah yang ada.', date: new Date('2023-10-28'), imageUrl: 'https://placehold.co/1200x675.png' },
];

async function getNewsArticle(id: string) {
    // In a real app, this would fetch from a database.
    return mockNews.find(article => article.id === id);
}

export default async function NewsArticlePage({ params }: { params: { id: string } }) {
  const article = await getNewsArticle(params.id);

  if (!article) {
    notFound();
  }

  const paragraphs = article.description.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-12 md:py-24">
        <article className="prose prose-lg dark:prose-invert mx-auto">
          <div className="relative mb-8 w-full aspect-video overflow-hidden rounded-lg">
            <Image
              src={article.imageUrl || "https://placehold.co/1200x675.png"}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
          
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-4">
            {article.title}
          </h1>

          <div className="flex items-center gap-6 text-muted-foreground text-sm mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(article.date).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              <span>Oleh: Admin Sekolah</span>
            </div>
          </div>
          
          <div className="space-y-6 text-foreground/90 dark:text-foreground/80">
             {paragraphs.map((p, index) => (
              <p key={index}>{p}</p>
            ))}
          </div>

        </article>
      </div>
    </div>
  );
}
