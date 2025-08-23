
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Award } from "lucide-react";

const achievements = [
  { student: "Tim Robotik SMPN 24", title: "Juara 1 Nasional Kontes Robot", description: "Meraih medali emas dalam kompetisi robotik tingkat nasional.", imageUrl: "https://placehold.co/600x400.png", hint: "robotics team" },
  { student: "Andi Pratama", title: "Olimpiade Sains Nasional", description: "Mendapatkan medali perak bidang Fisika.", imageUrl: "https://placehold.co/600x400.png", hint: "science olympiad" },
  { student: "Tim Basket Putri", title: "Juara Provinsi", description: "Menjadi juara pertama di kejuaraan basket antar sekolah se-provinsi.", imageUrl: "https://placehold.co/600x400.png", hint: "basketball trophy" },
  { student: "Siti Aisyah", title: "Lomba Menulis Puisi", description: "Juara 2 dalam ajang lomba menulis puisi tingkat nasional.", imageUrl: "https://placehold.co/600x400.png", hint: "writing poetry" },
  { student: "Kelompok Paduan Suara", title: "Festival Paduan Suara Internasional", description: "Mendapatkan predikat Gold dalam festival di Singapura.", imageUrl: "https://placehold.co/600x400.png", hint: "school choir" },
  { student: "Rina Wijaya", title: "Kejuaraan Catur", description: "Meraih juara 3 pada kejuaraan catur tingkat provinsi.", imageUrl: "https://placehold.co/600x400.png", hint: "playing chess" },
];


export default async function AchievementsPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
            Galeri Prestasi
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Merayakan pencapaian luar biasa dari siswa-siswi dan sekolah kami.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement, index) => (
            <Card key={index} className="group relative w-full overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
              <Image
                src={achievement.imageUrl || "https://placehold.co/600x400.png"}
                alt={achievement.title}
                width={600}
                height={400}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                data-ai-hint={achievement.hint || "achievement"}
              />
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
                 <div className="mb-4 h-12 w-12 rounded-full bg-accent/20 p-3 ring-4 ring-accent/30 transition-all duration-500 group-hover:bg-accent group-hover:ring-accent">
                    <Award className="h-full w-full text-accent transition-colors duration-500 group-hover:text-accent-foreground" />
                 </div>
                <h3 className="font-headline text-2xl font-bold text-white shadow-black drop-shadow-lg">
                  {achievement.title}
                </h3>
                <p className="text-md mt-1 font-semibold text-amber-300 drop-shadow-md">{achievement.student}</p>
                 <div className="mt-4 max-h-0 overflow-hidden transition-all duration-500 group-hover:max-h-40">
                  <p className="text-white/90">{achievement.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
