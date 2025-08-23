import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import Link from "next/link";

// PENTING: Untuk menyematkan pratinjau, ubah URL Google Drive Anda dari
// '.../view' menjadi '.../preview'.
const accreditations = [
    {
        title: "Sertifikat Akreditasi Nasional",
        description: "Sertifikat akreditasi resmi dari Badan Akreditasi Nasional Sekolah/Madrasah (BAN-S/M).",
        // Ganti dengan tautan Google Drive Anda yang sebenarnya dalam format pratinjau
        link: "https://drive.google.com/file/d/your_file_id/view?usp=sharing",
        embedLink: "https://drive.google.com/file/d/your_file_id/preview"
    },
    {
        title: "Piagam Penghargaan Sekolah Adiwiyata",
        description: "Pengakuan atas komitmen sekolah terhadap lingkungan.",
        link: "https://drive.google.com/file/d/your_file_id/view?usp=sharing",
        embedLink: "https://drive.google.com/file/d/your_file_id/preview"
    }
]

export default function AccreditationPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          Sertifikasi & Penghargaan
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Komitmen kami terhadap keunggulan yang diakui secara resmi.
        </p>
      </div>

      <section className="mt-16 space-y-12">
        {accreditations.map((doc, index) => (
            <Card key={index} className="overflow-hidden">
                <CardHeader>
                    <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                       <div className="flex items-center gap-4">
                           <FileText className="h-8 w-8 text-accent"/>
                           <div>
                               <CardTitle className="font-headline text-xl text-primary">{doc.title}</CardTitle>
                               <CardDescription className="mt-1">{doc.description}</CardDescription>
                           </div>
                       </div>
                        <Button asChild className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90 md:mt-0">
                            <Link href={doc.link} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4" />
                                Unduh Dokumen
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="aspect-h-4 aspect-w-3 w-full rounded-md border bg-muted">
                       <iframe
                        src={doc.embedLink}
                        className="h-full w-full"
                        style={{ border: 0, minHeight: '800px' }}
                        allow="fullscreen"
                        title={`Pratinjau ${doc.title}`}
                       ></iframe>
                    </div>
                </CardContent>
            </Card>
        ))}
        <div className="pt-4 text-center text-sm text-muted-foreground">
            <p>Untuk pengalaman terbaik, gunakan tombol unduh untuk melihat dokumen secara penuh.</p>
        </div>
      </section>
    </div>
  );
}
