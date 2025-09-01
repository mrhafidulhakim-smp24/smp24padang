import type { Metadata } from 'next';
import { getProfile } from '@/app/actions';
import { Book, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
    title: 'Visi & Misi SMPN 24 Padang | Fondasi Pendidikan Unggul',
    description:
        'Pahami visi dan misi SMPN 24 Padang yang menjadi landasan utama dalam membentuk karakter dan mencetak generasi berprestasi. Komitmen kami untuk pendidikan berkualitas.',
};

export const revalidate = 0;

export default async function VisionMissionPage() {
    const data = await getProfile();
    const vision = data?.vision || 'Visi belum tersedia.';
    const mission = data?.mission
        ? data.mission.split('\n')
        : ['Misi belum tersedia.'];

    return (
        <div className="container mx-auto max-w-6xl px-4 py-12 md:py-24">
            <div className="text-center">
                <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
                    Visi & Misi
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                    Prinsip-prinsip penuntun yang membentuk setiap aspek
                    kehidupan di SMPN 24 Padang.
                </p>
            </div>

            <section className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-6 w-6 text-accent" /> Visi Kami
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="py-4 text-base text-foreground/80">
                        {vision}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Book className="h-6 w-6 text-accent" /> Misi Kami
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="py-4 text-base text-foreground/80">
                        <ul className="list-disc space-y-3 pl-6">
                            {mission.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
