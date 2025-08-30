import { db } from '@/lib/db';
import { uniforms as uniformsTable } from '@/lib/db/schema';
import UniformList from './uniform-list';
import { eq } from 'drizzle-orm';

const REQUIRED_UNIFORMS = [
    { day: 'Senin', type: 'daily', description: 'Upacara' },
    { day: 'Selasa', type: 'daily', description: 'Putih Biru' },
    { day: 'Rabu', type: 'daily', description: 'Pramuka' },
    { day: 'Kamis', type: 'daily', description: 'Batik' },
    { day: 'Jumat', type: 'daily', description: 'Pakaian Muslim' },
    { day: null, type: 'sport', description: 'Seragam Olahraga' },
];

export default async function UniformAdminPage() {
    // 1. Fetch all existing uniforms
    const existingUniforms = await db.query.uniforms.findMany();

    // 2. Check for and create missing uniforms
    for (const required of REQUIRED_UNIFORMS) {
        const found = existingUniforms.some(existing => 
            required.type === 'sport' 
                ? existing.type === 'sport' 
                : existing.day === required.day
        );

        if (!found) {
            if (required.type === 'sport') {
                await db.insert(uniformsTable).values({
                    type: 'sport',
                    description: required.description,
                    day: null, // Explicitly set day to null for sport
                });
            } else {
                await db.insert(uniformsTable).values({
                    day: required.day,
                    type: 'daily',
                    description: required.description,
                });
            }
        }
    }

    // 3. Fetch the complete & ordered list to pass to the client
    const allUniforms = await db.query.uniforms.findMany();

    // Create a stable order for the UI
    const orderedUniforms = REQUIRED_UNIFORMS.map(required => {
        const uniform = allUniforms.find(u => 
            required.type === 'sport'
                ? u.type === 'sport'
                : u.day === required.day
        );
        // We can be sure uniform is not undefined here because we just seeded them
        return uniform!;
    });


    return (
        <UniformList initialUniformsData={orderedUniforms} />
    );
}
