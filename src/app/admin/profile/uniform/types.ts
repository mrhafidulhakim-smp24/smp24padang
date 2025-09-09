import { uniforms } from '@/lib/db/schema';

// Infer the base type from Drizzle schema
type InferredUniform = typeof uniforms.$inferSelect;

// Override the 'id' property to allow string, number, or bigint
export type Uniform = Omit<InferredUniform, 'id'> & {
    id: string | number | bigint;
};
