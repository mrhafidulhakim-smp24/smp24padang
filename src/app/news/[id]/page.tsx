
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, UserCircle } from "lucide-react";

const newsItems = [
    { id: '1', title: 'Kegiatan Class Meeting Akhir Semester', date: new Date(), description: 'Siswa-siswi menunjukkan bakat dan sportivitas dalam berbagai perlombaan seru seperti futsal, basket, dan tarik tambang untuk merayakan akhir semester. Kegiatan ini bertujuan untuk mempererat tali persaudaraan antar siswa dan menyegarkan pikiran setelah ujian.', imageUrl: 'https://placehold.co/1200x675.png', hint: 'students competition' },
    { id: '2', title: 'Workshop Guru Inovatif', date: new Date(), description: 'Para guru mengikuti pelatihan intensif mengenai metode pengajaran terbaru dan pemanfaatan teknologi dalam pendidikan untuk meningkatkan kualitas pembelajaran di kelas. Workshop ini menghadirkan para ahli di bidang pendidikan.', imageUrl: 'https://placehold.co/1200x675.png', hint: 'teacher workshop' },
    { id: '3', title: 'Peringatan Hari Lingkungan Hidup', date: new Date(), description: 'Seluruh warga sekolah berpartisipasi dalam aksi bersih-bersih lingkungan sekolah dan menanam pohon sebagai bentuk kepedulian terhadap bumi. Acara ini juga diisi dengan seminar tentang pentingnya menjaga kelestarian alam.', imageUrl: 'https://placehold.co/1200x675.png', hint: 'environmental cleanup' },
    { id: '4', title: 'Kunjungan Edukatif ke Museum Adityawarman', date: new Date(), description: 'Siswa kelas 8 melakukan kunjungan belajar ke museum untuk mempelajari sejarah dan budaya Minangkabau secara langsung. Mereka sangat antusias melihat berbagai koleksi peninggalan sejarah.', imageUrl: 'https://placehold.co/1200x675.png', hint: 'museum visit' },
];

export default function NewsArticlePage({ params }: { params: { id: string } }) {
  const article = newsItems.find(item => item.id === params.id);

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
              data-ai-hint={article.hint || "news article"}
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
