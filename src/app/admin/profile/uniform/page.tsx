import { db } from '@/lib/db';
import { uniforms } from '@/lib/db/schema';
import UniformList from './uniform-list';
import UniformForm from './uniform-form';

type Uniform = {
    id: number;
    day: string;
    description: string;
    image: string | null;
};

export default async function UniformAdminPage() {
    const uniformsData: Uniform[] = await db.query.uniforms.findMany({
        orderBy: (uniforms, { asc }) => [asc(uniforms.id)],
    });

    return (
        <div className="space-y-8">
            <UniformForm />
            <UniformList initialUniformsData={uniformsData} />
        </div>
    );
}