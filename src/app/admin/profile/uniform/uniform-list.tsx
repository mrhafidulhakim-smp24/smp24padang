'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import Image from 'next/image';
import { Uniform } from './types';
import UniformEditDialog from '@/components/admin/profile/uniform/uniform-edit-dialog';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Olahraga'];

type UniformListProps = {
    initialUniformsData: Uniform[];
};

export default function UniformList({ initialUniformsData = [] }: UniformListProps) {
    const [uniforms, setUniforms] = useState<Uniform[]>(initialUniformsData);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedUniform, setSelectedUniform] = useState<Uniform | null>(
        null,
    );

    useEffect(() => {
        setUniforms(initialUniformsData);
    }, [initialUniformsData]);

    const openEditDialog = (day: string) => {
        const uniformForDay =
            uniforms.find((u) => u.day === day) ||
            (day === 'Olahraga' && uniforms.find((u) => u.type === 'sport'));

        if (uniformForDay) {
            setSelectedUniform(uniformForDay);
        } else {
            const newUniform: Uniform = {
                id: `new-${day}`,
                day: day === 'Olahraga' ? null : day,
                type: day === 'Olahraga' ? 'sport' : 'daily',
                description: '',
                image: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setSelectedUniform(newUniform);
        }
        setIsEditDialogOpen(true);
    };

    const handleSaveSuccess = () => {
        // This will trigger a re-render of the parent page, which will re-fetch uniforms
        // For now, we'll rely on the revalidatePath in the action.
        // If more granular client-side updates are needed, this function would handle them.
        setIsEditDialogOpen(false); // Close dialog
        setSelectedUniform(null); // Clear selected uniform
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    Kelola Seragam Sekolah
                </CardTitle>
                <CardDescription className="mt-2 text-lg">
                    Perbarui gambar dan deskripsi untuk setiap seragam.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {DAYS.map((day) => {
                        const uniform =
                            uniforms.find((u) => u.day === day) ||
                            (day === 'Olahraga'
                                ? uniforms.find((u) => u.type === 'sport')
                                : undefined);

                        return (
                            <Card
                                key={day}
                                className="group relative overflow-hidden"
                            >
                                <CardHeader className="p-0">
                                    <Image
                                        src={
                                            uniform?.image ||
                                            'https://placehold.co/400x600.png'
                                        }
                                        alt={uniform?.description || day}
                                        width={400}
                                        height={600}
                                        className="aspect-[4/6] w-full object-cover"
                                    />
                                </CardHeader>
                                <CardContent className="p-4">
                                    <CardTitle className="font-headline text-xl text-primary">
                                        {day}
                                    </CardTitle>
                                    <CardDescription>
                                        {(uniform && uniform.description) ||
                                            'Belum ada deskripsi'}
                                    </CardDescription>
                                </CardContent>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openEditDialog(day)}
                                    >
                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </CardContent>
            <UniformEditDialog
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                initialUniform={selectedUniform}
                onSaveSuccess={handleSaveSuccess}
            />
        </Card>
    );
}