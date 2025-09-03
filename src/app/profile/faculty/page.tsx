'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { getStaff } from './actions';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { staff as StaffSchema } from '@/lib/db/schema';
import { type InferSelectModel } from 'drizzle-orm';

type Staff = InferSelectModel<typeof StaffSchema>;

function StaffCard({ person }: { person: Staff }) {
    return (
        <div
            className="flex flex-col items-center text-center group"
            data-aos="fade-up"
        >
            <div
                className={`relative w-full h-64 max-w-xs overflow-hidden rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl`}
            >
                <Image
                    src={person.imageUrl || 'https://placehold.co/400x500.png'}
                    alt={`Foto ${person.name || ''}`}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="mt-4">
                <h3
                    className={`font-headline text-xl font-bold text-primary`}
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

export default function FacultyPage() {
    const [allStaff, setAllStaff] = useState<Staff[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [positionFilter, setPositionFilter] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('');

    useEffect(() => {
        async function fetchData() {
            const staffData = await getStaff();
            setAllStaff(staffData);
        }
        fetchData();
    }, []);

    const { positions, subjects } = useMemo(() => {
        const staffPositions = [
            ...new Set(allStaff.map(s => s.position).filter(p => p && p.trim() !== '')),
        ];
        const staffSubjects = [
            ...new Set(allStaff.map(s => s.subject).filter(s => s && s.trim() !== '')),
        ];
        return { positions: staffPositions, subjects: staffSubjects };
    }, [allStaff]);

    const principal = allStaff.find((s) =>
        (s.position || '').toLowerCase().includes('kepala sekolah'),
    );

    const otherStaff = allStaff.filter(s => s.id !== principal?.id);

    const filteredStaff = otherStaff.filter((person) => {
        const nameMatch = (person.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const positionMatch = positionFilter ? person.position === positionFilter : true;
        const subjectMatch = subjectFilter ? person.subject === subjectFilter : true;
        return nameMatch && positionMatch && subjectMatch;
    });

    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="mb-12 text-center">
                    <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
                        Guru & Staf
                    </h1>
                    <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
                        Temui para guru dan staf berpengalaman yang berdedikasi
                        untuk membimbing siswa kami.
                    </p>
                </div>

                {/* Principal Section */}
                {principal && (
                    <section className="mb-20">
                        <h2 className="mb-12 text-center font-headline text-3xl font-bold text-primary md:text-4xl">
                            Kepala Sekolah
                        </h2>
                        <div className="flex justify-center" data-aos="fade-up">
                             <div className="flex flex-col items-center text-center group">
                                <div className="relative w-64 h-80 max-w-xs overflow-hidden rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                                    <Image
                                        src={principal.imageUrl || 'https://placehold.co/400x500.png'}
                                        alt={`Foto ${principal.name || ''}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="mt-4">
                                    <h3 className="font-headline text-2xl font-bold text-primary">
                                        {principal.name}
                                    </h3>
                                    <p className="font-semibold text-base text-muted-foreground">
                                        {principal.position}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Staff List Section */}
                <section>
                     <h2 className="mb-12 text-center font-headline text-3xl font-bold text-primary md:text-4xl">
                        Daftar Guru & Staf
                    </h2>
                    <Card className="p-4 md:p-6 mb-8 shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                type="text"
                                placeholder="Cari nama guru atau staf..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full text-base"
                            />
                            <Select value={positionFilter} onValueChange={setPositionFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter berdasarkan jabatan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Semua Jabatan</SelectItem>
                                    {positions.map(pos => <SelectItem key={pos} value={pos}>{pos}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter berdasarkan mata pelajaran" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Semua Mata Pelajaran</SelectItem>
                                    {subjects.map(sub => <SelectItem key={sub} value={sub}>{sub}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </Card>

                    {filteredStaff.length > 0 ? (
                        <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {filteredStaff.map((person) => (
                                <StaffCard
                                    key={person.id}
                                    person={person}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-xl text-muted-foreground">
                                Tidak ada guru atau staf yang cocok dengan kriteria pencarian.
                            </p>
                            <p className="mt-2 text-base text-muted-foreground/80">
                                Coba periksa kembali ejaan atau ubah pilihan filter Anda.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
