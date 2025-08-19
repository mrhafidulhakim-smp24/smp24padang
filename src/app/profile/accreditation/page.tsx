import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import Link from "next/link";

const accreditations = [
    {
        title: "Sertifikat Akreditasi Nasional",
        description: "Sertifikat akreditasi resmi dari Badan Akreditasi Nasional Sekolah/Madrasah (BAN-S/M).",
        // Ganti dengan tautan Google Drive Anda yang sebenarnya
        link: "https://drive.google.com/file/d/your_file_id/view?usp=sharing"
    },
    {
        title: "Piagam Penghargaan Sekolah Adiwiyata",
        description: "Pengakuan atas komitmen sekolah terhadap lingkungan.",
        link: "https://drive.google.com/file/d/your_file_id/view?usp=sharing"
    }
]

export default function AccreditationPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          Akreditasi & Pengakuan
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Komitmen kami terhadap keunggulan yang diakui secara resmi.
        </p>
      </div>

      <section className="mt-16 space-y-8">
        {accreditations.map((doc, index) => (
            <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                        <FileText className="h-8 w-8 text-accent"/>
                        <div>
                            <CardTitle className="font-headline text-xl text-primary">{doc.title}</CardTitle>
                            <CardDescription className="mt-1">{doc.description}</CardDescription>
                        </div>
                    </div>
                    <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <Link href={doc.link} target="_blank" rel="noopener noreferrer">
                            <Download className="mr-2 h-4 w-4" />
                            Lihat Dokumen
                        </Link>
                    </Button>
                </CardHeader>
            </Card>
        ))}
        <div className="pt-4 text-center text-sm text-muted-foreground">
            <p>Dokumen di-host di Google Drive. Klik tombol untuk melihat di tab baru.</p>
        </div>
      </section>
    </div>
  );
}
