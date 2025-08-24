
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, BookMarked } from "lucide-react";
import Image from "next/image";
import { getAcademics } from "./actions";

export default async function AcademicsPage() {
  const academics = await getAcademics();

  if (!academics) {
    return (
       <div className="container mx-auto px-4 py-12 md:py-24 text-center">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
            Informasi Akademik
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Konten akademik belum tersedia. Silakan periksa kembali nanti.
          </p>
       </div>
    )
  }

  const curriculumParagraphs = academics.curriculumDescription.split('\n').filter(p => p.trim() !== '');
  const structureParagraphs = academics.structureDescription.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          Informasi Akademik
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Menumbuhkan Keunggulan Intelektual dan Semangat Belajar Seumur Hidup.
        </p>
      </div>

      <Tabs defaultValue="curriculum" className="mt-12 w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
          <TabsTrigger value="curriculum">
            <BookMarked className="mr-2 h-5 w-5" /> Kurikulum
          </TabsTrigger>
          <TabsTrigger value="organization">
            <Building className="mr-2 h-5 w-5" /> Struktur Pembelajaran
          </TabsTrigger>
        </TabsList>
        <TabsContent value="curriculum" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">
                {academics.curriculumTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/80">
               <Image 
                  src={academics.curriculumImageUrl || "https://placehold.co/1200x400.png"} 
                  alt="Curriculum" 
                  width={1200} 
                  height={400} 
                  className="mb-6 w-full rounded-lg object-cover" 
                  data-ai-hint={academics.curriculumImageHint || "library books"}
                />
              {curriculumParagraphs.map((p, i) => <p key={i}>{p}</p>)}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="organization" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">
                {academics.structureTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/80">
              <Image 
                src={academics.structureImageUrl || "https://placehold.co/1200x400.png"} 
                alt="Organization" 
                width={1200} 
                height={400} 
                className="mb-6 w-full rounded-lg object-cover" 
                data-ai-hint={academics.structureImageHint || "school building"}
              />
              {structureParagraphs.map((p, i) => <p key={i}>{p}</p>)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
