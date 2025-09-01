'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getStaff } from './actions';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

function StaffCard({
    person,
    isPrincipal = false,
}: {
    person: any;
    isPrincipal?: boolean;
}) {
    const imageSize = isPrincipal ? 'w-64 h-80' : 'w-full h-64';
    const nameSize = isPrincipal ? 'text-2xl' : 'text-xl';

    return (
        <div
            className="flex flex-col items-center text-center group"
            data-aos="fade-up"
        >
            <div
                className={`relative ${imageSize} max-w-xs overflow-hidden rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl`}
            >
                <Image
                    src={person.imageUrl || 'https://placehold.co/400x500.png'}
                    alt={`Foto ${person.name}`}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="mt-4">
                <h3
                    className={`font-headline ${nameSize} font-bold text-primary`}
                >
                    {person.name}
                </h3>
                <p className="font-semibold text-base text-muted-foreground">
                    {person.position}
                </p>
                {person.subject && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                        {person.subject}
                    </p>
                )}
                {person.homeroomOf && (
                    <Badge variant="secondary" className="mt-2">
                        Wali Kelas {person.homeroomOf}
                    </Badge>
                )}
            </div>
        </div>
    );
}

function StaffSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section>
            <h2 className="mb-12 text-center font-headline text-3xl font-bold text-primary md:text-4xl">
                {title}
            </h2>
            {children}
        </section>
    );
}

export default function FacultyPage() {
    const [allStaff, setAllStaff] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function fetchData() {
            const staffData = await getStaff();
            setAllStaff(staffData);
        }
        fetchData();
    }, []);

    const filteredStaff = allStaff.filter((person) =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const principal = filteredStaff.find((s) =>
        s.position.toLowerCase().includes('kepala sekolah'),
    );
    const vicePrincipals = filteredStaff.filter((s) =>
        s.position.toLowerCase().includes('wakil'),
    );
    const teachingStaff = filteredStaff.filter(
        (s) =>
            !s.position.toLowerCase().includes('kepala sekolah') &&
            !s.position.toLowerCase().includes('wakil'),
    );

    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="mb-16 text-center">
                    <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
                        Guru & Staf
                    </h1>
                    <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
                        Temui para guru dan staf berpengalaman yang berdedikasi
                        untuk membimbing siswa kami.
                    </p>
                    <div className="mt-8 mx-auto max-w-xl">
                        <Input
                            type="text"
                            placeholder="Cari nama guru atau staf..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full text-base p-4 border-2 border-gray-200 rounded-lg focus:ring-primary focus:border-primary"
                        />
                    </div>
                </div>

                <div className="space-y-20">
                    {/* Principal Section */}
                    {principal && (
                        <StaffSection title="Kepala Sekolah">
                            <div className="flex justify-center">
                                <StaffCard person={principal} isPrincipal />
                            </div>
                        </StaffSection>
                    )}

                    {/* Vice Principals Section */}
                    {vicePrincipals.length > 0 && (
                        <StaffSection title="Wakil Kepala Sekolah">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 md:grid-cols-4 justify-center">
                                {vicePrincipals.map((person) => (
                                    <StaffCard
                                        key={person.id}
                                        person={person}
                                    />
                                ))}
                            </div>
                        </StaffSection>
                    )}

                    {/* Teaching Staff Section */}
                    {teachingStaff.length > 0 && (
                        <StaffSection title="Guru & Staf">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                {teachingStaff.map((person) => (
                                    <StaffCard
                                        key={person.id}
                                        person={person}
                                    />
                                ))}
                            </div>
                        </StaffSection>
                    )}

                    {/* No Results Message */}
                    {filteredStaff.length === 0 && searchTerm && (
                        <div className="text-center py-16">
                            <p className="text-xl text-muted-foreground">
                                Tidak ada hasil untuk &quot;<b>{searchTerm}</b>
                                &quot;.
                            </p>
                            <p className="mt-2 text-base text-muted-foreground/80">
                                Coba periksa kembali ejaan atau gunakan kata
                                kunci lain.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
