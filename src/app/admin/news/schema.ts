
import { z } from "zod";
import { news } from "@/lib/db/schema";
import { createSelectSchema } from "drizzle-zod";

export const NewsArticleSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  date: z.coerce.date({
    errorMap: () => ({ message: "Format tanggal tidak valid" }),
  }),
});

export type NewsArticleFormData = z.infer<typeof NewsArticleSchema>;

export const SelectNewsArticleSchema = createSelectSchema(news);
export type NewsArticle = z.infer<typeof SelectNewsArticleSchema>;
