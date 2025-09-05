import { z } from "zod";

export const videoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  youtubeUrl: z.string().url("Invalid YouTube URL"),
});