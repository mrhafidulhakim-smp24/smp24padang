import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Target, Users, Award, Network } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          Profil Sekolah
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Mengenal lebih dekat SMPN 24 Padang.
        </p>
      </div>

      <section className="mt-16">
        <Card className="overflow-hidden md:grid md:grid-cols-3">
          <div className="relative h-64 md:h-full">
            <Image
              src="https://placehold.co/600x800.png"
              alt="Principal"
              layout="fill"
              objectFit="cover"
              data-ai-hint="professional portrait"
            />
          </div>
          <div className="p-8 md:col-span-2">
            <h2 className="font-headline text-3xl font-bold text-primary">
              Sambutan dari Kepala Sekolah
            </h2>
            <p className="mt-4 text-foreground/80">
              Selamat datang di SMPN 24 Padang! Kami adalah komunitas yang berdedikasi untuk menumbuhkan keunggulan akademik, pengembangan karakter, dan kecintaan belajar seumur hidup. Komitmen kami adalah menyediakan lingkungan yang aman, membina, dan merangsang di mana setiap siswa dapat berkembang dan mencapai potensi penuh mereka.
            </p>
            <p className="mt-4 text-foreground/80">
              Kami percaya pada pendekatan holistik terhadap pendidikan, yang menyeimbangkan kekakuan akademis dengan ekspresi artistik, prestasi atletik, dan pengabdian masyarakat. Fakultas kami yang berbakat dan berdedikasi hadir untuk membimbing dan menginspirasi siswa kami dalam perjalanan pendidikan mereka.
            </p>
            <p className="mt-6 font-semibold text-primary">
              Dr. Budi Santoso, Kepala Sekolah
            </p>
          </div>
        </Card>
      </section>

      <section className="mt-16">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">Jelajahi Tentang Kami</h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              Pelajari lebih lanjut tentang apa yang membuat sekolah kami istimewa.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/profile/vision-mission">
              <Card className="h-full transform text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <CardHeader className="items-center">
                  <div className="rounded-full bg-accent/20 p-4">
                    <Target className="h-10 w-10 text-accent" />
                  </div>
                  <CardTitle className="font-headline pt-4 text-primary">Visi & Misi</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Prinsip-prinsip penuntun yang membentuk setiap aspek kehidupan di SMPN 24 Padang.</p>
                </CardContent>
              </Card>
            </Link>
             <Link href="/profile/faculty">
              <Card className="h-full transform text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <CardHeader className="items-center">
                  <div className="rounded-full bg-accent/20 p-4">
                    <Users className="h-10 w-10 text-accent" />
                  </div>
                  <CardTitle className="font-headline pt-4 text-primary">Guru & Staf</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Temui para pendidik berpengalaman yang membimbing siswa kami.</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/profile/organization-structure">
              <Card className="h-full transform text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <CardHeader className="items-center">
                  <div className="rounded-full bg-accent/20 p-4">
                    <Network className="h-10 w-10 text-accent" />
                  </div>
                  <CardTitle className="font-headline pt-4 text-primary">Struktur Organisasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Lihat bagaimana sekolah kami terstruktur untuk mencapai kesuksesan.</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/profile/accreditation">
              <Card className="h-full transform text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <CardHeader className="items-center">
                  <div className="rounded-full bg-accent/20 p-4">
                    <Award className="h-10 w-10 text-accent" />
                  </div>
                  <CardTitle className="font-headline pt-4 text-primary">Sertifikat Akreditasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Lihat pengakuan dan sertifikasi resmi sekolah kami.</p>
                </CardContent>
              </Card>
            </Link>
          </div>
      </section>
    </div>
  );
}
