
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const galleryItems = [
  { id: "1", imageUrl: "https://placehold.co/600x400.png", alt: "Kegiatan Belajar Mengajar di Kelas", category: "Akademik", hint: "classroom students" },
  { id: "2", imageUrl: "https://placehold.co/600x400.png", alt: "Tim Basket Sekolah Merayakan Kemenangan", category: "Olahraga", hint: "basketball team celebration" },
  { id: "3", imageUrl: "https://placehold.co/600x400.png", alt: "Pameran Seni Siswa", category: "Seni & Budaya", hint: "student art exhibition" },
  { id: "4", imageUrl: "https://placehold.co/600x400.png", alt: "Siswa Melakukan Percobaan di Laboratorium Sains", category: "Sains", hint: "science lab students" },
  { id: "5", imageUrl: "https://placehold.co/600x500.png", alt: "Upacara Bendera Hari Senin", category: "Kegiatan Sekolah", hint: "flag ceremony" },
  { id: "6", imageUrl: "https://placehold.co/600x800.png", alt: "Perpustakaan Sekolah", category: "Fasilitas", hint: "school library" },
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
                  height={item.imageUrl.includes('600x800') ? 800 : item.imageUrl.includes('600x500') ? 500 : 400}
                  src={item.imageUrl}
                  alt={item.alt}
                  className="h-auto w-full transform transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={item.hint || 'gallery image'}
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
