import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Book, Target } from "lucide-react";

export default function VisionMissionPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          Visi & Misi
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Prinsip-prinsip penuntun yang membentuk setiap aspek kehidupan di SMPN 24 Padang.
        </p>
      </div>

      <section className="mt-16">
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-headline text-2xl">
                <Target className="mr-3 h-6 w-6 text-accent" /> Visi Kami
              </AccordionTrigger>
              <AccordionContent className="py-4 text-base text-foreground/80">
                Menjadi lembaga pendidikan terkemuka yang diakui karena memberdayakan siswa untuk menjadi warga dunia yang welas asih, inovatif, dan bertanggung jawab.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="font-headline text-2xl">
                <Book className="mr-3 h-6 w-6 text-accent" /> Misi Kami
              </AccordionTrigger>
              <AccordionContent className="py-4 text-base text-foreground/80">
                <ul className="list-disc space-y-3 pl-6">
                  <li>Menyediakan pendidikan berkualitas tinggi dan komprehensif yang memupuk rasa ingin tahu intelektual.</li>
                  <li>Membina budaya saling menghormati, berintegritas, dan bertanggung jawab sosial.</li>
                  <li>Membekali siswa dengan keterampilan dan pola pikir untuk berhasil di dunia yang cepat berubah.</li>
                  <li>Menciptakan komunitas siswa, orang tua, dan pendidik yang kolaboratif dan inklusif.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
      </section>
    </div>
  );
}
