import { uniforms } from '@/lib/db/schema';

// This is the single source of truth for the Uniform type.
// It's derived directly from the database schema.
export type Uniform = typeof uniforms.$inferSelect;
