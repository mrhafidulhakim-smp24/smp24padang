
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type OrgChart = {
  id: string;
  title: string;
  image: string;
  hint: string;
};

// Data ini seharusnya diambil dari CMS/database di aplikasi nyata.
const orgCharts: OrgChart[] = [
  { id: "1", title: "Struktur Pimpinan Sekolah", image: "https://placehold.co/1200x800.png", hint: "organization chart" },
  { id: "2", title: "Struktur Organisasi Siswa Intra Sekolah (OSIS)", image: "https://placehold.co/1200x800.png", hint: "organization chart" },
  { id: "3", title: "Struktur Tata Usaha", image: "https://placehold.co/1200x800.png", hint: "organization chart" },
];


export default function OrganizationStructurePage() {
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
          <section key={chart.id}>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-center text-3xl text-primary">
                  {chart.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-lg border">
                   <Image
                      src={chart.image}
                      alt={chart.title}
                      width={1200}
                      height={800}
                      className="h-auto w-full object-contain"
                      data-ai-hint={chart.hint}
                    />
                </div>
              </CardContent>
            </Card>
          </section>
        ))}
      </div>
    </div>
  );
}
