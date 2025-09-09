'use client';

import { db } from '@/lib/db';
import { uniforms as uniformsTable } from '@/lib/db/schema';
import UniformList from './uniform-list';
import { eq } from 'drizzle-orm';
import { getUniformPageDescription, updateUniformPageDescription } from './actions';
import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Menyimpan...' : 'Simpan Deskripsi'}
        </Button>
    );
}

export default function UniformAdminPageClient() {
    const [uniformPageDescription, setUniformPageDescription] = useState('');
    const [initialUniformsData, setInitialUniformsData] = useState([]);
    const { toast } = useToast();

    const [state, formAction] = useFormState(async (prevState: any, formData: FormData) => {
        const description = formData.get('uniformPageDescription') as string;
        const result = await updateUniformPageDescription(description);
        return result;
    }, { success: false, message: '' });

    useEffect(() => {
        async function fetchData() {
            // Fetch uniform page description
            const desc = await getUniformPageDescription();
            setUniformPageDescription(desc);

            // Existing uniform list logic
            const existingUniforms = await db.query.uniforms.findMany();

            for (const required of REQUIRED_UNIFORMS) {
                if (required.type === 'sport') {
                    const existingSportUniform = existingUniforms.find(
                        (u) => u.type === 'sport',
                    );
                    if (existingSportUniform) {
                        await db
                            .update(uniformsTable)
                            .set({
                                description: required.description,
                                updatedAt: new Date(),
                            })
                            .where(eq(uniformsTable.id, existingSportUniform.id));
                    } else {
                        await db.insert(uniformsTable).values({
                            type: 'sport',
                            description: required.description,
                            day: null,
                        });
                    }
                } else {
                    await db
                        .insert(uniformsTable)
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

            const allUniforms = await db.query.uniforms.findMany();

            const orderedUniforms = REQUIRED_UNIFORMS.map((required) => {
                const uniformFromDb = allUniforms.find((u) => {
                    if (required.type === 'sport') {
                        return u.type === 'sport';
                    }
                    return u.day === required.day;
                });

                return {
                    ...required,
                    ...(uniformFromDb || {}),
                };
            });
            setInitialUniformsData(orderedUniforms);
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (state.success) {
            toast({ title: 'Sukses!', description: state.message });
        } else if (state.message) {
            toast({
                title: 'Gagal',
                description: state.message,
                variant: 'destructive',
            });
        }
    }, [state, toast]);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Kelola Seragam</h1>

            <div className="mb-8 p-6 border rounded-lg shadow-sm bg-white">
                <h2 className="text-2xl font-semibold mb-4">Deskripsi Halaman Seragam</h2>
                <form action={formAction} className="space-y-4">
                    <div>
                        <Label htmlFor="uniformPageDescription">Deskripsi</Label>
                        <Textarea
                            id="uniformPageDescription"
                            name="uniformPageDescription"
                            value={uniformPageDescription}
                            onChange={(e) => setUniformPageDescription(e.target.value)}
                            rows={5}
                        />
                    </div>
                    <SubmitButton />
                </form>
            </div>

            <h2 className="text-2xl font-bold mb-4">Daftar Seragam</h2>
            <UniformList initialUniformsData={initialUniformsData} />
        </div>
    );
}
