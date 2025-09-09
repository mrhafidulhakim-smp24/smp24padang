import { z } from 'zod';
import { faqs } from '@/lib/db/schema';
import { createSelectSchema } from 'drizzle-zod';

export const FaqSchema = z.object({
    question: z.string().min(10, 'Pertanyaan minimal 10 karakter'),
    answer: z.string().min(10, 'Jawaban minimal 10 karakter'),
});

export type FaqFormData = z.infer<typeof FaqSchema>;

export const SelectFaqSchema = createSelectSchema(faqs);
export type Faq = z.infer<typeof SelectFaqSchema>;
