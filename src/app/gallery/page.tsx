import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const galleryItems = [
  {
    src: "https://placehold.co/600x400.png",
    alt: "Kegiatan Belajar Mengajar di Kelas",
    category: "Akademik",
    hint: "classroom students",
  },
  {
    src: "https://placehold.co/600x400.png",
    alt: "Tim Basket Sekolah Merayakan Kemenangan",
    category: "Olahraga",
    hint: "basketball team celebration",
  },
  {
    src: "https://placehold.co/600x400.png",
    alt: "Pameran Seni Siswa",
    category: "Seni & Budaya",
    hint: "student art exhibition",
  },
  {
    src: "https://placehold.co/600x400.png",
    alt: "Siswa Melakukan Percobaan di Laboratorium Sains",
    category: "Sains",
    hint: "science lab students",
  },
  {
    src: "https://placehold.co/600x400.png",
    alt: "Upacara Bendera Peringatan Hari Kemerdekaan",
    category: "Acara Sekolah",
    hint: "flag ceremony",
  },
  {
    src: "https://placehold.co/600x400.png",
    alt: "Kegiatan Pramuka di Alam Terbuka",
    category: "Ekstrakurikuler",
    hint: "scouts camping",
  },
   {
    src: "https://placehold.co/600x400.png",
    alt: "Lomba Cerdas Cermat Tingkat Nasional",
    category: "Prestasi",
    hint: "quiz competition students",
  },
  {
    src: "https://placehold.co/600x400.png",
    alt: "Pentas Drama Tahunan",
    category: "Seni & Budaya",
    hint: "school play drama",
  },
];

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          Galeri Sekolah
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Momen-momen berharga dari kegiatan belajar, berkarya, dan berprestasi di sekolah kami.
        </p>
      </div>

      <div className="mt-12 columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
        {galleryItems.map((item, index) => (
          <div key={index} className="group relative mb-4 break-inside-avoid">
             <Card className="overflow-hidden">
                <Image
                  width={600}
                  height={400}
                  src={item.src}
                  alt={item.alt}
                  className="h-auto w-full transform transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={item.hint}
                />
             </Card>
             <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-sm font-bold text-white">{item.category}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
