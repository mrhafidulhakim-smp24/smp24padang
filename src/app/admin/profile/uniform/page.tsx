import { db } from '@/lib/db';
import UniformList from './uniform-list';
import { Uniform } from './types';

export default async function UniformAdminPage() {
    const uniformsData = await db.query.uniforms.findMany({
        orderBy: (uniforms, { asc }) => [asc(uniforms.id)],
    });

    return (
        <UniformList initialUniformsData={uniformsData} />
    );
}