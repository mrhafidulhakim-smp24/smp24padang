import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUniforms } from "./actions";

export const dynamic = 'force-dynamic';

export default async function UniformPage() {
  const uniforms = await getUniforms();

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

      <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-8">
        {uniforms.map((uniform) => (
          <Card key={uniform.id} className="overflow-hidden text-center">
            <CardHeader className="p-0">
              <div className="relative aspect-[4/6] w-full">
                <Image
                  src={uniform.image || 'https://placehold.co/400x600.png'}
                  alt={uniform.day || ''}
                  fill
                  className="object-cover"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <CardTitle className="font-headline text-lg md:text-xl text-primary">{uniform.day}</CardTitle>
              <p className="mt-1 text-xs md:text-sm text-muted-foreground">{uniform.description}</p>
            </CardContent>
          </Card>
        ))}
        <Card className="overflow-hidden text-center">
          <CardHeader className="p-0">
            <div className="relative aspect-[4/6] w-full">
              <Image
                src={'https://placehold.co/400x600.png'}
                alt={"Pakaian Olahraga"}
                fill
                className="object-cover"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <CardTitle className="font-headline text-lg md:text-xl text-primary">Pakaian Olahraga</CardTitle>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">Digunakan saat pelajaran olahraga</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}