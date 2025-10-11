import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { getFaqs } from '@/app/admin/faq/actions';

export default async function FaqAccordion() {
    const faqs = await getFaqs();
    if (!faqs || faqs.length === 0) {
        return null;
    }

    return (
        <Accordion type="single" collapsible className="w-full">
            {faqs.map(
                (
                    faq: { id: string; question: string; answer: string },
                    index: number,
                ) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-left text-lg font-semibold">
                            {`${index + 1}. ${faq.question}`}
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground text-left whitespace-pre-wrap">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ),
            )}
        </Accordion>
    );
}
