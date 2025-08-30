import { db } from '@/lib/db';
import { uniforms as uniformsTable } from '@/lib/db/schema';
import UniformList from './uniform-list';
import { eq } from 'drizzle-orm';

type RequiredUniform = {
    day: string | null | undefined;
    type: 'daily' | 'sport';
    description: string;
};

const REQUIRED_UNIFORMS: RequiredUniform[] = [
    { day: 'Senin', type: 'daily', description: 'Upacara' },
    { day: 'Selasa', type: 'daily', description: 'Putih Biru' },
    { day: 'Rabu', type: 'daily', description: 'Pramuka' },
    { day: 'Kamis', type: 'daily', description: 'Batik' },
    { day: 'Jumat', type: 'daily', description: 'Pakaian Muslim' },
    { day: null, type: 'sport', description: 'Seragam Olahraga' },
];

export default async function UniformAdminPage() {
    const existingUniforms = await db.query.uniforms.findMany();

    for (const required of REQUIRED_UNIFORMS) {
        if (required.type === 'sport') {
            const existingSportUniform = existingUniforms.find(u => u.type === 'sport');
            if (existingSportUniform) {
                await db.update(uniformsTable).set({
                    description: required.description,
                    updatedAt: new Date(),
                }).where(eq(uniformsTable.id, existingSportUniform.id));
            } else {
                await db.insert(uniformsTable).values({
                    type: 'sport',
                    description: required.description,
                    day: null, // Explicitly null
                });
            }
        } else {
            // For daily uniforms, use onConflictDoUpdate
            await db.insert(uniformsTable)
                .values({
                    type: required.type,
                    description: required.description,
                    day: required.day,
                })
                .onConflictDoUpdate({
                    target: [uniformsTable.type, uniformsTable.day],
                    set: {
                        description: required.description,
                        updatedAt: new Date(),
                    },
                });
        }
    }

    // Fetch the complete & ordered list to pass to the client
    const allUniforms = await db.query.uniforms.findMany();

    // Create a stable order for the UI
    const orderedUniforms = REQUIRED_UNIFORMS.map((required) => {
        const uniform = allUniforms.find(u => {
            if (required.type === 'sport') {
                return u.type === 'sport';
            } else {
                return u.day === required.day;
            }
        });
        // We can be sure uniform is not undefined here because we just seeded them
        return uniform!;
    });

    return (
        <UniformList initialUniformsData={orderedUniforms} />
    );
}