
import { z } from 'zod';

export const AcademicDataSchema = z.object({
  curriculumTitle: z.string().min(3, "Judul minimal 3 karakter"),
  curriculumDescription: z.string().min(10, "Deskripsi minimal 10 karakter"),
  curriculumImage: z.any().optional(),
  structureTitle: z.string().min(3, "Judul minimal 3 karakter"),
  structureDescription: z.string().min(10, "Deskripsi minimal 10 karakter"),
  structureImage: z.any().optional(),
});

export type AcademicData = z.infer<typeof AcademicDataSchema>;
