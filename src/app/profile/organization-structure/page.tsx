
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

// In a real application, you would fetch this data from your CMS/database.
// This configuration determines which view to show on the public page.
const orgChartConfig = {
  // mode can be "image" or "gdrive"
  mode: "image" as "image" | "gdrive",
  // This would be the URL of the uploaded image.
  imageUrl: "https://placehold.co/1200x1700.png",
  // This would be the embeddable Google Drive link.
  gdriveEmbedUrl: "https://drive.google.com/file/d/your_file_id/preview",
};


export default function OrganizationStructurePage() {
  const { mode, imageUrl, gdriveEmbedUrl } = orgChartConfig;

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          Struktur Organisasi
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Hirarki kepemimpinan dan manajemen di SMPN 24 Padang.
        </p>
      </div>

      <section className="mt-16">
        <Card className="overflow-hidden">
          <CardContent className="p-4 md:p-6">
            {mode === "image" && imageUrl ? (
              <div className="w-full">
                <Image
                  src={imageUrl}
                  alt="Bagan Struktur Organisasi"
                  width={1200}
                  height={1700}
                  className="h-auto w-full object-contain"
                  data-ai-hint="organization chart"
                />
              </div>
            ) : mode === "gdrive" && gdriveEmbedUrl ? (
              <div className="aspect-h-4 aspect-w-3 w-full rounded-md border bg-muted">
                <iframe
                  src={gdriveEmbedUrl}
                  className="h-full w-full"
                  style={{ border: 0, minHeight: '1000px' }}
                  allow="fullscreen"
                  title="Struktur Organisasi"
                ></iframe>
              </div>
            ) : (
                <div className="flex items-center justify-center h-96 bg-muted rounded-md">
                    <p className="text-muted-foreground">Struktur organisasi belum dikonfigurasi.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
