
import { z } from "zod";
import { achievements } from "@/lib/db/schema";
import { createSelectSchema } from "drizzle-zod";


export const AchievementSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  student: z.string().min(3, "Siswa/Tim minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
});

// For client-side form validation and type inference
export type AchievementFormData = z.infer<typeof AchievementSchema>;

// For server-side operations, derived from the database schema
export const SelectAchievementSchema = createSelectSchema(achievements);
export type Achievement = z.infer<typeof SelectAchievementSchema>;
