import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Book,
    Target,
    Users,
    Award,
    Network,
    Shirt,
    Swords,
} from 'lucide-react';
import { getProfile } from '../actions';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const profile = await getProfile();

    const welcomeParagraphs = profile?.principalWelcome
        .split('\n')
        .filter((p) => p.trim() !== '');

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
                            src={
                                profile?.principalImageUrl ||
                                'https://placehold.co/600x800.png'
                            }
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
                            {welcomeParagraphs?.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>
                        <p className="mt-6 font-semibold text-primary">
                            {profile?.principalName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Kepala SMPN 24 Padang
                        </p>
                    </div>
                </Card>
            </section>

            <section className="mt-16">
                <div className="text-center">
                    <h2 className="font-headline text-3xl font-bold text-primary md:text-4xl">
                        Sejarah Sekolah
                    </h2>
                    <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
                        Perjalanan SMPN 24 Padang dari masa ke masa.
                    </p>
                </div>
                <div className="mt-12">
                    <Card>
                        <CardContent className="p-8 text-foreground/80 whitespace-pre-wrap">
                            {profile?.history}
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}