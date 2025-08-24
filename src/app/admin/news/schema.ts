
import { z } from "zod";

export const NewsArticleSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  date: z.coerce.date({
    errorMap: () => ({ message: "Format tanggal tidak valid" }),
  }),
});

export type NewsArticle = z.infer<typeof NewsArticleSchema> & {
    id: string;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
};
