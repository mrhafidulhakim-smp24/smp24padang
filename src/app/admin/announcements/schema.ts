
import { z } from "zod";
import { announcements } from "@/lib/db/schema";
import { createSelectSchema } from "drizzle-zod";

export const AnnouncementSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  date: z.coerce.date({
    errorMap: () => ({ message: "Format tanggal tidak valid" }),
  }),
  pdfUrl: z.string().url({ message: "URL PDF tidak valid" }).optional().or(z.literal('')),
});

export type AnnouncementFormData = z.infer<typeof AnnouncementSchema>;

export const SelectAnnouncementSchema = createSelectSchema(announcements);
export type Announcement = z.infer<typeof SelectAnnouncementSchema>;
