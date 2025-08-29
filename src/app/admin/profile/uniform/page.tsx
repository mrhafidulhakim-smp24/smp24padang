import { db } from '@/lib/db';
import { uniforms } from '@/lib/db/schema';
import UniformList from './uniform-list';

type Uniform = typeof uniforms.$inferSelect;

export default async function UniformAdminPage() {
    const uniformsData: Uniform[] = await db.query.uniforms.findMany({
        orderBy: (uniforms, { asc }) => [asc(uniforms.id)],
    });

    return (
        <UniformList initialUniformsData={uniformsData} />
    );
}