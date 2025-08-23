
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, UserCircle } from "lucide-react";

const newsItems = [
    { id: "1", title: "Kegiatan Class Meeting Akhir Semester", description: "Seluruh siswa mengikuti berbagai perlombaan dalam rangka class meeting untuk menyegarkan pikiran setelah ujian akhir semester. Perlombaan yang diadakan antara lain futsal, tarik tambang, dan Cerdas Cermat. Kegiatan ini bertujuan untuk mempererat tali persaudaraan antar siswa dan mengembangkan sportivitas.", date: new Date(), imageUrl: "https://placehold.co/1200x675.png", hint: "students competition" },
    { id: "2", title: "Peringatan Hari Guru Nasional", description: "Peringatan Hari Guru Nasional di SMPN 24 Padang berlangsung khidmat dan meriah. Acara diisi dengan upacara bendera dan persembahan dari siswa untuk para guru sebagai bentuk penghargaan atas jasa-jasa mereka dalam mendidik.", date: new Date(), imageUrl: "https://placehold.co/1200x675.png", hint: "teacher ceremony" },
    { id: "3", title: "Studi Tur ke Museum Adityawarman", description: "Siswa kelas 8 melakukan studi tur edukatif ke Museum Adityawarman untuk mempelajari sejarah dan budaya Minangkabau secara langsung. Para siswa terlihat antusias mengikuti penjelasan dari pemandu museum dan mencatat informasi penting.", date: new Date(), imageUrl: "https://placehold.co/1200x675.png", hint: "museum trip" },
    { id: "4", title: "Workshop Literasi Digital untuk Siswa", description: "Bekerja sama dengan komunitas lokal, sekolah mengadakan workshop literasi digital untuk membekali siswa dengan kemampuan berpikir kritis di dunia maya. Workshop ini membahas cara mengidentifikasi berita bohong dan menjaga keamanan data pribadi.", date: new Date(), imageUrl: "https://placehold.co/1200x675.png", hint: "digital literacy workshop" },
];

async function getArticle(id: string) {
    const article = newsItems.find(item => item.id === id);
    return article;
}

export default async function NewsArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id);

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
