
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, UserCircle } from "lucide-react";

const newsItems = [
    { id: "1", date: new Date(), title: "Juara 1 Lomba Cerdas Cermat Tingkat Kota", description: "Tim cerdas cermat SMPN 24 Padang berhasil meraih Juara 1 dalam kompetisi tingkat kota, menunjukkan keunggulan akademik yang membanggakan. Kompetisi yang diikuti oleh puluhan sekolah terbaik ini menjadi bukti nyata dari kerja keras siswa dan bimbingan intensif para guru.\n\nKemenangan ini diharapkan dapat memotivasi siswa lain untuk terus berprestasi di berbagai bidang, baik akademik maupun non-akademik. Sekolah berkomitmen untuk terus mendukung pengembangan potensi setiap siswa secara maksimal.", imageUrl: "https://placehold.co/600x400.png", hint: "students winning trophy" },
    { id: "2", date: new Date(), title: "Kegiatan Jumat Bersih dan Sehat", description: "Seluruh warga sekolah berpartisipasi dalam kegiatan Jumat Bersih untuk menciptakan lingkungan belajar yang nyaman dan asri. Kegiatan ini meliputi pembersihan ruang kelas, taman sekolah, dan area umum lainnya.\n\nSelain membersihkan lingkungan, kegiatan ini juga bertujuan untuk menumbuhkan rasa tanggung jawab dan kepedulian siswa terhadap kebersihan. Lingkungan yang bersih akan mendukung proses belajar mengajar yang lebih efektif.", imageUrl: "https://placehold.co/600x400.png", hint: "students cleaning school" },
    { id: "3", date: new Date(), title: "Peringatan Hari Kemerdekaan RI ke-79", description: "Upacara bendera dan berbagai lomba meriahkan peringatan HUT RI ke-79 di SMPN 24 Padang, menumbuhkan semangat nasionalisme. Siswa-siswi antusias mengikuti berbagai perlombaan tradisional seperti panjat pinang, balap karung, dan tarik tambang.\n\nAcara ini tidak hanya menjadi ajang hiburan, tetapi juga sebagai sarana untuk mempererat tali persaudaraan antar siswa dan menanamkan nilai-nilai perjuangan para pahlawan.", imageUrl: "https://placehold.co/600x400.png", hint: "flag ceremony" },
    { id: "4", date: new Date(), title: "Studi Tur Edukatif ke Museum Adityawarman", description: "Siswa kelas 8 melakukan studi tur ke Museum Adityawarman untuk mempelajari sejarah dan budaya Minangkabau secara langsung.", imageUrl: "https://placehold.co/600x400.png", hint: "students in museum" },
    { id: "5", date: new Date(), title: "Pelatihan Kepemimpinan untuk Pengurus OSIS", description: "Pengurus OSIS periode baru mengikuti pelatihan kepemimpinan untuk meningkatkan kapasitas organisasi dan manajerial.", imageUrl: "https://placehold.co/600x400.png", hint: "leadership training" },
    { id: "6", date: new Date(), title: "Pameran Karya Seni Siswa di Akhir Semester", description: "Kreativitas siswa dipamerkan dalam pameran seni rupa yang menampilkan lukisan, patung, dan kerajinan tangan.", imageUrl: "https://placehold.co/600x400.png", hint: "student art exhibition" },
];

async function getNewsArticle(id: string) {
    return newsItems.find(item => item.id === id);
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
