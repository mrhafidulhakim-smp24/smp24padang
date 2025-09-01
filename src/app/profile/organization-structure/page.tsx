import type { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getOrganizationStructures } from './actions';

export const metadata: Metadata = {
    title: 'Struktur Organisasi SMPN 24 Padang | Bagan Kepengurusan Sekolah',
    description:
        'Lihat bagan struktur organisasi SMPN 24 Padang, termasuk kepengurusan sekolah, unit-unit, dan divisi. Pahami hierarki dan tanggung jawab di sekolah kami.',
};

export const dynamic = 'force-dynamic';

export default async function OrganizationStructurePage() {
    const orgChartsData = await getOrganizationStructures();

    // Define the desired order of the organization charts
    const desiredOrder = [
        'Struktur Pimpinan Sekolah',
        'Struktur Tata Usaha',
        'Struktur Organisasi Siswa Intra Sekolah (OSIS)',
    ];

    // Sort the charts based on the desired order
    const sortedOrgCharts = [...orgChartsData].sort((a, b) => {
        const indexA = desiredOrder.indexOf(a.title);
        const indexB = desiredOrder.indexOf(b.title);

        // If a title isn't in the desired order, push it to the back
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;

        return indexA - indexB;
    });

    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <div className="text-center">
                <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
                    Struktur Organisasi
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                    Mengenal bagan kepengurusan di berbagai unit SMPN 24 Padang.
                </p>
            </div>

            <div className="mt-16 space-y-16">
                {sortedOrgCharts.map((chart) => (
                    <section key={chart.type}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-center text-3xl text-primary">
                                    {chart.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-lg border aspect-video bg-muted">
                                    {chart.imageUrl ? (
                                        <Image
                                            src={chart.imageUrl}
                                            alt={chart.title}
                                            fill
                                            className="object-contain"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground">
                                            Bagan organisasi belum diunggah.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                ))}
            </div>
        </div>
    );
}
