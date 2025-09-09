import FaqAccordion from '@/components/faq/faq-accordion';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pertanyaan Umum',
    description:
        'Temukan jawaban atas pertanyaan yang sering diajukan mengenai SMPN 24 Padang.',
};

export default function FaqPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <div className="text-center">
                <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
                    Pertanyaan Umum
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                    Kami telah mengumpulkan beberapa pertanyaan yang paling
                    sering diajukan untuk membantu Anda.
                </p>
            </div>
            <div className="mt-12 max-w-3xl mx-auto">
                <FaqAccordion />
            </div>
        </div>
    );
}
