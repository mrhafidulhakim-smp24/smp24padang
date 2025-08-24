
import { z } from "zod";

export const AchievementSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  student: z.string().min(3, "Siswa/Tim minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
});

export type Achievement = z.infer<typeof AchievementSchema> & {
    id: string;
    imageUrl: string | null;
    createdAt: Date;
};
