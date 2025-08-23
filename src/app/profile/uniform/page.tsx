
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const uniforms = [
  {
    day: "Senin & Selasa",
    description: "Seragam Putih Biru lengkap dengan atribut sekolah.",
    image: "https://placehold.co/400x600.png",
    hint: "school uniform blue",
  },
  {
    day: "Rabu & Kamis",
    description: "Seragam Batik identitas sekolah.",
    image: "https://placehold.co/400x600.png",
    hint: "batik uniform",
  },
  {
    day: "Jumat",
    description: "Seragam Pramuka lengkap.",
    image: "https://placehold.co/400x600.png",
    hint: "scout uniform",
  },
  {
    day: "Seragam Olahraga",
    description: "Digunakan pada saat pelajaran Pendidikan Jasmani.",
    image: "https://placehold.co/400x600.png",
    hint: "sport uniform",
  },
];

export default function UniformPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          Seragam Sekolah
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Panduan seragam resmi untuk siswa-siswi SMPN 24 Padang.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {uniforms.map((uniform) => (
          <Card key={uniform.day} className="overflow-hidden text-center">
            <CardHeader className="p-0">
              <div className="relative aspect-[4/6] w-full">
                <Image
                  src={uniform.image}
                  alt={uniform.day}
                  fill
                  className="object-cover"
                  data-ai-hint={uniform.hint}
                />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="font-headline text-xl text-primary">{uniform.day}</CardTitle>
              <p className="mt-2 text-muted-foreground">{uniform.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
