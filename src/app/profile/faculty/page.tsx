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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Book, Home } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type Staff = InferSelectModel<typeof StaffSchema>;

// Komponen untuk dialog detail staf
function StaffDetailDialog({ staff, open, onOpenChange }: { staff: Staff | null; open: boolean; onOpenChange: (open: boolean) => void; }) {
    if (!staff) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg md:max-w-2xl p-0">
                <div className="grid md:grid-cols-2">
                    <div className="relative h-64 md:h-96 bg-muted md:rounded-l-lg overflow-hidden">
                        <Image
                            src={staff.imageUrl || ''}
                            alt={staff.name}
                            layout="fill"
                            className="object-cover object-top"
                        />
                    </div>
                    <div className="p-6 flex flex-col">
                        <DialogHeader className="text-left">
                            <DialogTitle className="text-3xl font-bold tracking-tight">{staff.name}</DialogTitle>
                            <DialogDescription className="text-lg text-primary">{staff.position}</DialogDescription>
                        </DialogHeader>
                        <Separator className="my-4" />
                        <div className="space-y-4 flex-grow">
                            {staff.subject && (
                                <div className="flex items-start">
                                    <Book className="h-5 w-5 mr-3 mt-1 flex-shrink-0 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Mata Pelajaran</p>
                                        <p className="font-semibold">{staff.subject}</p>
                                    </div>
                                </div>
                            )}
                            {staff.homeroomOf && (
                                <div className="flex items-start">
                                    <Home className="h-5 w-5 mr-3 mt-1 flex-shrink-0 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Wali Kelas</p>
                                        <p className="font-semibold">{staff.homeroomOf}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}


// Sub-komponen untuk menampilkan kartu staf
function StaffCard({ person, onClick }: { person: Staff, onClick: () => void }) {
    return (
        <div onClick={onClick} className="cursor-pointer group">
            <Card key={person.id} className="text-center overflow-hidden transform transition-all h-full flex flex-col group-hover:scale-105 group-hover:shadow-xl">
                <CardContent className="p-6 flex flex-col items-center flex-grow">
                    <div className="w-24 h-24 mb-4 rounded-md shadow-lg flex items-center justify-center bg-muted overflow-hidden">
                        {person.imageUrl ? (
                            <Image
                                src={person.imageUrl}
                                alt={person.name}
                                width={96}
                                height={96}
                                className="object-cover object-top h-full w-full"
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
        </div>
    );
}

export default function FacultyPage() {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [search, setSearch] = useState('');
    const [positionFilter, setPositionFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const facultyData = await getFaculty();
            setStaff(facultyData);
            setLoading(false);
        }
        loadData();
    }, []);

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
                    {principal && (
                        <section className="py-12 rounded-lg bg-gradient-to-b from-primary/5 to-background dark:from-slate-800/50">
                            <h2 className="text-3xl font-bold text-center mb-8">Kepala Sekolah</h2>
                            <div className="flex justify-center">
                                <div className="w-full max-w-xs">
                                    {principal && <StaffCard person={principal} onClick={() => setSelectedStaff(principal)} />}
                                </div>
                            </div>
                        </section>
                    )}

                    {leadership.length > 0 && (
                        <section className="py-12 rounded-lg bg-gradient-to-b from-primary/5 to-background dark:from-slate-800/50">
                            <h2 className="text-3xl font-bold text-center mb-8">Pimpinan Sekolah</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                                {leadership.map(p => <StaffCard key={p.id} person={p} onClick={() => setSelectedStaff(p)} />)}
                            </div>
                        </section>
                    )}

                    {otherStaff.length > 0 && (
                        <section className="py-12 rounded-lg bg-gradient-to-b from-primary/5 to-background dark:from-slate-800/50">
                            <h2 className="text-3xl font-bold text-center mb-8">Guru & Tenaga Pendidik</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {otherStaff.map(p => <StaffCard key={p.id} person={p} onClick={() => setSelectedStaff(p)} />)}
                            </div>
                        </section>
                    )}
                </div>
            ) : filteredStaff.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredStaff.map((person) => <StaffCard key={person.id} person={person} onClick={() => setSelectedStaff(person)} />)}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-xl text-muted-foreground">Tidak ada data staf yang cocok dengan pencarian Anda.</p>
                </div>
            )}

            <StaffDetailDialog 
                staff={selectedStaff}
                open={selectedStaff !== null}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setSelectedStaff(null);
                    }
                }}
            />
        </div>
    );
}
