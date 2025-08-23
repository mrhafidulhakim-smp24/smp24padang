
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, HeartPulse, Music, BrainCircuit, ShieldCheck, Palette } from "lucide-react";
import Image from "next/image";

const categories = [
  {
    name: "Olahraga",
    icon: Award,
    activities: ["Sepak Bola", "Bola Basket", "Bola Voli", "Bulu Tangkis", "Pencak Silat"],
    image: "https://placehold.co/600x400.png",
    hint: "students playing soccer"
  },
  {
    name: "Seni & Budaya",
    icon: Palette,
    activities: ["Tari Tradisional", "Paduan Suara", "Klub Musik (Band)", "Seni Rupa"],
    image: "https://placehold.co/600x400.png",
    hint: "students painting"
  },
  {
    name: "Akademik & Sains",
    icon: BrainCircuit,
    activities: ["Kelompok Ilmiah Remaja (KIR)", "Olimpiade Sains Nasional (OSN)", "English Club", "Klub Matematika"],
    image: "https://placehold.co/600x400.png",
    hint: "students science club"
  },
  {
    name: "Pengembangan Diri & Kepemimpinan",
    icon: ShieldCheck,
    activities: ["Pramuka", "Palang Merah Remaja (PMR)", "Pasukan Pengibar Bendera (Paskibra)"],
    image: "https://placehold.co/600x400.png",
    hint: "scout members"
  },
];

export default function ExtracurricularPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          Kegiatan Ekstrakurikuler
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Temukan minat, kembangkan bakat, dan bangun karakter melalui beragam pilihan kegiatan di luar jam pelajaran.
        </p>
      </div>

      <div className="mt-16 space-y-12">
        {categories.map((category) => (
          <Card key={category.name} className="overflow-hidden md:grid md:grid-cols-5 md:items-center">
            <div className="relative h-64 w-full md:col-span-2 md:h-full">
               <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                  data-ai-hint={category.hint}
                />
            </div>
            <div className="p-6 md:col-span-3">
              <CardHeader className="p-0">
                <div className="flex items-center gap-3">
                  <category.icon className="h-8 w-8 text-accent" />
                  <CardTitle className="font-headline text-2xl text-primary">{category.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                <p className="mb-4 text-muted-foreground">
                  Wadah untuk menyalurkan energi, sportivitas, dan kerja sama tim.
                </p>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {category.activities.map((activity) => (
                    <li key={activity} className="flex items-center gap-2">
                       <ShieldCheck className="h-4 w-4 text-primary/50" />
                       <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
