
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Target, Users, Award, Network, Shirt, Swords } from "lucide-react";
import { getProfile } from "../actions";


export default async function ProfilePage() {
  const profile = await getProfile();
  
  const welcomeParagraphs = profile?.principalWelcome.split('\n').filter(p => p.trim() !== '');

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
              src={profile?.principalImageUrl || "https://placehold.co/600x800.png"}
              alt="Principal"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="p-8 md:col-span-2">
            <h2 className="font-headline text-3xl font-bold text-primary">
              Sambutan dari Kepala Sekolah
            </h2>
            <div className="mt-4 space-y-4 text-foreground/80">
              {welcomeParagraphs?.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <p className="mt-6 font-semibold text-primary">
              {profile?.principalName}
            </p>
            <p className="text-sm text-muted-foreground">Kepala SMPN 24 Padang</p>
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
                  <CardTitle className="font-headline pt-4 text-primary">Sertifikasi & Penghargaan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Lihat pengakuan dan sertifikasi resmi sekolah kami.</p>
                </CardContent>
              </Card>
            </Link>
             <Link href="/profile/uniform">
              <Card className="h-full transform text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <CardHeader className="items-center">
                  <div className="rounded-full bg-accent/20 p-4">
                    <Shirt className="h-10 w-10 text-accent" />
                  </div>
                  <CardTitle className="font-headline pt-4 text-primary">Seragam Sekolah</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Panduan seragam resmi untuk siswa-siswi kami.</p>
                </CardContent>
              </Card>
            </Link>
             <Link href="/profile/extracurricular">
              <Card className="h-full transform text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <CardHeader className="items-center">
                  <div className="rounded-full bg-accent/20 p-4">
                    <Swords className="h-10 w-10 text-accent" />
                  </div>
                  <CardTitle className="font-headline pt-4 text-primary">Ekstrakurikuler</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Temukan minat dan kembangkan bakat melalui kegiatan kami.</p>
                </CardContent>
              </Card>
            </Link>
          </div>
      </section>
    </div>
  );
}
