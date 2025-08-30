import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getOrganizationStructures } from './actions';

export const dynamic = 'force-dynamic';

export default async function OrganizationStructurePage() {
  const orgCharts = await getOrganizationStructures();

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
        {orgCharts.map((chart) => (
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