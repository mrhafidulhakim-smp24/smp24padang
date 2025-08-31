
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award, BrainCircuit, Palette, ShieldCheck, Dumbbell, Paintbrush, FlaskConical, Users } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: 'Ekstrakurikuler SMPN 24 Padang | Kembangkan Bakat & Minat Siswa',
  description: 'Jelajahi beragam kegiatan ekstrakurikuler di SMPN 24 Padang, mulai dari olahraga, seni, sains, hingga pengembangan diri. Temukan wadah untuk mengembangkan bakat dan minat Anda di sekolah kami di Indonesia.',
};

const extracurriculars = [
  { id: "1", name: "Sepak Bola", category: "Olahraga", description: "Mengembangkan bakat sepak bola dan kerja sama tim.", image: "https://placehold.co/600x400.png" },
  { id: "2", name: "Tari Tradisional", category: "Seni & Budaya", description: "Mempelajari dan melestarikan seni tari daerah.", image: "https://placehold.co/600x400.png" },
  { id: "3", name: "Kelompok Ilmiah Remaja (KIR)", category: "Akademik & Sains", description: "Mendorong penelitian dan inovasi di kalangan siswa.", image: "https://placehold.co/600x400.png" },
  { id: "4", name: "Bola Basket", category: "Olahraga", description: "Melatih ketangkasan, strategi, dan sportivitas di lapangan.", image: "https://placehold.co/600x400.png" },
  { id: "5", name: "Paduan Suara", category: "Seni & Budaya", description: "Mengasah kemampuan vokal dan harmoni dalam sebuah tim.", image: "https://placehold.co/600x400.png" },
  { id: "6", name: "Pramuka", category: "Pengembangan Diri", description: "Membentuk karakter mandiri, disiplin, dan cinta alam.", image: "https://placehold.co/600x400.png" },
];

const categories = [
  { name: "Olahraga", icon: Dumbbell },
  { name: "Seni & Budaya", icon: Paintbrush },
  { name: "Akademik & Sains", icon: FlaskConical },
  { name: "Pengembangan Diri", icon: Users },
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

      <div className="mt-16 space-y-16">
        {categories.map((category) => {
          const activities = extracurriculars.filter(e => e.category === category.name);
          if (activities.length === 0) return null;

          return (
            <section key={category.name}>
              <div className="flex items-center gap-3 mb-8">
                <category.icon className="h-8 w-8 text-accent" />
                <h2 className="font-headline text-3xl font-bold text-primary">{category.name}</h2>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {activities.map((activity) => (
                  <Card key={activity.id} className="group flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <CardHeader className="p-0">
                      <div className="relative aspect-video w-full">
                        <Image
                          src={activity.image}
                          alt={activity.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col p-4">
                      <CardTitle className="font-headline text-xl text-primary">{activity.name}</CardTitle>
                      <CardDescription className="mt-2 flex-1">{activity.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  );
}
