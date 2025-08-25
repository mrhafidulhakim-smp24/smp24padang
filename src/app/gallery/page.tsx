
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { getGalleryItems } from "./actions";

export default async function GalleryPage() {
  const galleryItems = await getGalleryItems();

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

      {galleryItems.length > 0 ? (
        <div className="mt-12 columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
          {galleryItems.map((item, index) => (
            <div key={index} className="group relative mb-4 break-inside-avoid">
              <Card className="overflow-hidden">
                <Image
                  width={600}
                  height={400} // This is a default, aspect ratio will be maintained
                  src={item.src}
                  alt={item.alt}
                  className="h-auto w-full transform transition-transform duration-300 group-hover:scale-105"
                />
              </Card>
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-sm font-bold text-white">{item.category}</p>
                <p className="text-xs text-white/90">{item.alt}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center text-muted-foreground">
          <p>Belum ada gambar di galeri. Silakan periksa kembali nanti.</p>
        </div>
      )}
    </div>
  );
}
