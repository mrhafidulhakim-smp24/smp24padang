import { z } from 'zod';

export const videoSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  description: z.string().optional(),
  youtubeUrl: z.string().url('Please enter a valid YouTube URL.'),
});
