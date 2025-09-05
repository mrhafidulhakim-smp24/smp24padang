'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getFaculty } from './actions';
import type { staff as StaffSchema } from '@/lib/db/schema';
import { type InferSelectModel } from 'drizzle-orm';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { Badge } from '@/components/ui/badge';

type Staff = InferSelectModel<typeof StaffSchema>;

// Sub-komponen untuk menampilkan kartu staf, agar tidak ada duplikasi kode
function StaffCard({ person }: { person: Staff }) {
    return (
        <Card key={person.id} className="text-center overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl h-full flex flex-col">
            <CardContent className="p-6 flex flex-col items-center flex-grow">
                <div className="w-24 h-24 mb-4 rounded-md shadow-lg flex items-center justify-center bg-muted">
                    {person.imageUrl ? (
                        <Image
                            src={person.imageUrl}
                            alt={person.name}
                            width={96}
                            height={96}
                            className="rounded-md object-cover h-full w-full"
                        />
                    ) : (
                        <span className="text-3xl text-muted-foreground">{person.name.charAt(0)}</span>
                    )}
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">{person.name}</h3>
                <p className="text-sm text-foreground/80">{person.position}</p>
                {person.subject && (
                    <p className="text-sm text-foreground/70 mt-1">{person.subject}</p>
                )}
                <div className="flex-grow"></div>
                {person.homeroomOf && (
                    <Badge variant="secondary" className="mt-2">Wali Kelas {person.homeroomOf}</Badge>
                )}
            </CardContent>
        </Card>
    );
}

export default function FacultyPage() {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [search, setSearch] = useState('');
    const [positionFilter, setPositionFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const facultyData = await getFaculty();
            setStaff(facultyData);
            setLoading(false);
        }
        loadData();
    }, []);

    // Logika untuk memisahkan staf berdasarkan jabatan
    const principal = staff.find(s => s.position === 'Kepala Sekolah');
    const leadershipOrder = [
        'Wakil Kurikulum',
        'Wakil Kesiswaan',
        'Wakil Sarana & Prasarana',
        'Koordinator Tata Usaha',
    ];
    const leadership = staff
        .filter(s => leadershipOrder.includes(s.position || ''))
        .sort((a, b) => leadershipOrder.indexOf(a.position || '') - leadershipOrder.indexOf(b.position || ''));
    const otherStaff = staff.filter(
        s => s.position !== 'Kepala Sekolah' && !leadershipOrder.includes(s.position || '')
    );

    const positions = [
        'all',
        ...new Set(
            staff
                .map((s) => s.position)
                .filter((p): p is string => typeof p === 'string' && p.trim() !== '')
        ),
    ];

    const filteredStaff = staff.filter((person) => {
        const nameMatch = person.name.toLowerCase().includes(search.toLowerCase());
        const positionMatch = positionFilter === 'all' || person.position === positionFilter;
        return nameMatch && positionMatch;
    });

    const showHierarchicalView = positionFilter === 'all' && search === '';

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight">Guru & Staf</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Kenali para pendidik dan staf yang berdedikasi di sekolah kami.
                </p>
            </header>

            <Card className="mb-8 p-4 md:p-6 sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex flex-col md:flex-row gap-4">
                    <Input
                        placeholder="Cari nama..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-grow"
                    />
                    <Select value={positionFilter} onValueChange={setPositionFilter}>
                        <SelectTrigger className="w-full md:w-[240px]">
                            <SelectValue placeholder="Filter berdasarkan jabatan" />
                        </SelectTrigger>
                        <SelectContent>
                            {positions.map((position) => (
                                <SelectItem key={position} value={position}>
                                    {position === 'all' ? 'Semua Jabatan' : position}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            {loading ? (
                <div className="text-center py-16"><p className="text-xl text-muted-foreground">Memuat data...</p></div>
            ) : showHierarchicalView ? (
                <div className="space-y-12">
                    {/* Principal Section */}
                    {principal && (
                        <section className="py-12 rounded-lg bg-gradient-to-b from-primary/5 to-background dark:from-slate-800/50">
                            <h2 className="text-3xl font-bold text-center mb-8">Kepala Sekolah</h2>
                            <div className="flex justify-center">
                                <div className="w-full max-w-xs"><StaffCard person={principal} /></div>
                            </div>
                        </section>
                    )}

                    {/* Leadership Section */}
                    {leadership.length > 0 && (
                        <section className="py-12 rounded-lg bg-gradient-to-b from-primary/5 to-background dark:from-slate-800/50">
                            <h2 className="text-3xl font-bold text-center mb-8">Pimpinan Sekolah</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                                {leadership.map(p => <StaffCard key={p.id} person={p} />)}
                            </div>
                        </section>
                    )}

                    {/* Other Staff Section */}
                    {otherStaff.length > 0 && (
                        <section className="py-12 rounded-lg bg-gradient-to-b from-primary/5 to-background dark:from-slate-800/50">
                            <h2 className="text-3xl font-bold text-center mb-8">Guru & Tenaga Pendidik</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {otherStaff.map(p => <StaffCard key={p.id} person={p} />)}
                            </div>
                        </section>
                    )}
                </div>
            ) : filteredStaff.length > 0 ? (
                // Filtered View
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredStaff.map((person) => <StaffCard key={person.id} person={person} />)}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-xl text-muted-foreground">Tidak ada data staf yang cocok dengan pencarian Anda.</p>
                </div>
            )}
        </div>
    );
}
