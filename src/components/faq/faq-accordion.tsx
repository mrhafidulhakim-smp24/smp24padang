import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { getFaqsForPublic } from '@/app/faq/actions';

export default async function FaqAccordion() {
    const faqs = await getFaqsForPublic();

    if (!faqs || faqs.length === 0) {
        return null; // Or a message indicating no FAQs
    }

    return (
        <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left text-lg font-semibold">
                        {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground">
                        {faq.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
