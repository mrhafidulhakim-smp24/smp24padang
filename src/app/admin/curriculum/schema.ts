import { z } from 'zod';

export const curriculumSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    pdfUrl: z.string().url('Must be a valid Google Drive PDF URL'),
});

export type CurriculumFormValues = z.infer<typeof curriculumSchema>;
