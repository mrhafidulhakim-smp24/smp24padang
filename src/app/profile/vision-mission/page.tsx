import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getProfile } from "@/app/actions";
import { Book, Target } from "lucide-react";

export const revalidate = 0;

export default async function VisionMissionPage() {
  const data = await getProfile();
  const vision = data?.vision || "Visi belum tersedia.";
  const mission = data?.mission ? data.mission.split("\n") : ["Misi belum tersedia."];

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
                {vision}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="font-headline text-2xl">
                <Book className="mr-3 h-6 w-6 text-accent" /> Misi Kami
              </AccordionTrigger>
              <AccordionContent className="py-4 text-base text-foreground/80">
                <ul className="list-disc space-y-3 pl-6">
                  {mission.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
      </section>
    </div>
  );
}

