
import { z } from "zod";

export const StaffSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  position: z.string().min(3, "Jabatan minimal 3 karakter"),
  subject: z.string().optional(),
  homeroomOf: z.string().optional(),
});
