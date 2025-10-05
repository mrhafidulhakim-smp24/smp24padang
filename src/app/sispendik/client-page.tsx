'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    getAggregatedData,
    getClassRanking,
    AggregatedData,
    getTotalsSummary,
    getTopWasteTypes,
    getGuruRanking,
} from '@/app/admin/sispendik/actions';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
} from 'recharts';

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

// --- TYPE DEFINITIONS ---
type TopWasteType = { wasteType: string; totalKg: number; totalValue: number };
type ClassRanking = { className: string; total: number; totalValue: number; jenisList: string | null };
type GuruRanking = { guruName: string; totalKg: number };

// --- DUMMY DATA ---
const dummyClassRanking: ClassRanking[] = [
    { className: 'VII A', total: 15.5, totalValue: 77500, jenisList: 'Plastik, Kertas' },
    { className: 'VIII B', total: 12.2, totalValue: 61000, jenisList: 'Kertas' },
    { className: 'IX C', total: 10.8, totalValue: 54000, jenisList: 'Botol' },
    { className: 'VII B', total: 9.5, totalValue: 47500, jenisList: 'Plastik' },
    { className: 'VIII A', total: 8.1, totalValue: 40500, jenisList: 'Kardus' },
    { className: 'IX A', total: 7.9, totalValue: 39500, jenisList: 'Plastik, Kertas' },
    { className: 'VII C', total: 6.3, totalValue: 31500, jenisList: 'Kertas' },
    { className: 'VIII C', total: 5.0, totalValue: 25000, jenisList: 'Botol' },
    { className: 'IX B', total: 4.8, totalValue: 24000, jenisList: 'Plastik' },
    { className: 'VII D', total: 4.5, totalValue: 22500, jenisList: 'Kertas' },
    { className: 'VIII D', total: 3.2, totalValue: 16000, jenisList: 'Botol' },
];

const dummyGuruRanking: GuruRanking[] = [
    { guruName: 'Budi Santoso', totalKg: 8.5 },
    { guruName: 'Ani Wijaya', totalKg: 7.2 },
    { guruName: 'Citra Lestari', totalKg: 6.8 },
    { guruName: 'Dewi Anggraini', totalKg: 5.4 },
    { guruName: 'Eko Prasetyo', totalKg: 4.9 },
    { guruName: 'Fitriani', totalKg: 4.5 },
    { guruName: 'Gunawan', totalKg: 3.8 },
    { guruName: 'Hasan', totalKg: 3.1 },
];


// --- CUSTOM TOOLTIPS ---
const CustomClassTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background border p-2 rounded-md shadow-md">
                <p className="font-bold">{label}</p>
                <p className="text-sm">Total Sampah: {Number(payload[0].value).toFixed(2)} kg</p>
                <p className="text-sm text-muted-foreground">Jenis: {payload[0].payload.jenisList || 'N/A'}</p>
            </div>
        );
    }
    return null;
};

const CustomGuruTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background border p-2 rounded-md shadow-md">
                <p className="font-bold">{label}</p>
                <p className="text-sm">Total Sampah: {Number(payload[0].value).toFixed(2)} kg</p>
            </div>
        );
    }
    return null;
};

export default function SispendikClientPage() {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [aggregatedData, setAggregatedData] = useState<AggregatedData[]>([]);
    const [classRanking, setClassRanking] = useState<ClassRanking[]>(dummyClassRanking);
    const [guruRanking, setGuruRanking] = useState<GuruRanking[]>(dummyGuruRanking);
    const [totalWaste, setTotalWaste] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [topClasses, setTopClasses] = useState<string[]>([]);
    const [topWasteTypes, setTopWasteTypes] = useState<TopWasteType[]>([]);
    const [levelFilter, setLevelFilter] = useState<'all' | '7' | '8' | '9'>('all');

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    useEffect(() => {
        const fetchData = async () => {
            const [aggData, rankData, summary, topWasteRes, guruRankData] = await Promise.all([
                getAggregatedData(month, year),
                getClassRanking(month, year),
                getTotalsSummary(month, year),
                getTopWasteTypes(month, year),
                getGuruRanking(month, year),
            ]);

            if (aggData.data) setAggregatedData(aggData.data);

            if (rankData.data && Array.isArray(rankData.data) && rankData.data.length > 0) {
                const typedData = rankData.data as ClassRanking[];
                const filteredData = typedData.filter((c) => levelFilter === 'all' || c.className.startsWith(levelFilter));
                setClassRanking(filteredData);
                setTopClasses(filteredData.slice(0, 3).map((c) => c.className));
            } else {
                setClassRanking(dummyClassRanking); // Fallback to dummy data
                setTopClasses(dummyClassRanking.slice(0, 3).map((c) => c.className));
            }

            if (summary.data) {
                setTotalIncome(Number(summary.data.totalValue) || 0);
                setTotalWaste(Number(summary.data.totalKg) || 0);
            } else {
                setTotalIncome(0);
                setTotalWaste(0);
            }

            if (topWasteRes.data) setTopWasteTypes(topWasteRes.data as TopWasteType[]);
            else setTopWasteTypes([]);

            if (guruRankData.data && Array.isArray(guruRankData.data) && guruRankData.data.length > 0) {
                setGuruRanking(guruRankData.data as GuruRanking[]);
            } else {
                setGuruRanking(dummyGuruRanking); // Fallback to dummy data
            }
        };

        fetchData();
    }, [month, year, levelFilter]);

    return (
        <div className="container mx-auto py-6">
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Sispendik Bank Sampah</h2>
                    <p className="text-muted-foreground">Pantau data sampah dan peringkat dalam program bank sampah sekolah.</p>
                </div>

                {/* Top Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-green-100 dark:bg-green-900">
                        <CardHeader><CardTitle>Total Sampah</CardTitle><p className="text-2xl font-bold">{Number(totalWaste || 0).toFixed(2)} kg</p></CardHeader>
                    </Card>
                    <Card className="bg-green-100 dark:bg-green-900">
                        <CardHeader><CardTitle>Total Pendapatan</CardTitle><p className="text-2xl font-bold">Rp {totalIncome.toLocaleString('id-ID')}</p></CardHeader>
                    </Card>
                    <Card className="bg-green-100 dark:bg-green-900">
                        <CardHeader>
                            <CardTitle>Top 3 Kelas</CardTitle>
                            <div className="text-lg font-bold">{topClasses.length > 0 ? topClasses.map((c, i) => <div key={i}>{i + 1}. {c}</div>) : <p className="text-2xl">-</p>}</div>
                        </CardHeader>
                    </Card>
                    <Card className="bg-green-100 dark:bg-green-900">
                        <CardHeader>
                            <CardTitle>Jenis Sampah Teratas</CardTitle>
                            <div className="space-y-2 pt-2">{topWasteTypes.length > 0 ? topWasteTypes.map((w, i) => <div key={i} className="flex justify-between items-baseline"><p className="font-bold text-sm">{i + 1}. {w.wasteType}</p><p className="text-sm text-muted-foreground">{Number(w.totalKg || 0).toFixed(2)} kg</p></div>) : <p className="text-center">-</p>}</div>
                        </CardHeader>
                    </Card>
                </div>

                {/* Class Ranking Section */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                    <Card className="lg:col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle>Diagram Peringkat Kelas</CardTitle>
                            <div className="flex items-center space-x-2">
                                <Select value={String(month)} onValueChange={(v) => setMonth(parseInt(v))}>
                                    <SelectTrigger className="w-auto text-xs h-8"><SelectValue placeholder="Bulan" /></SelectTrigger>
                                    <SelectContent>{MONTHS.map((m, idx) => <SelectItem key={m} value={(idx + 1).toString()}>{m}</SelectItem>)}</SelectContent>
                                </Select>
                                <Select value={String(year)} onValueChange={(v) => setYear(parseInt(v))}>
                                    <SelectTrigger className="w-auto text-xs h-8"><SelectValue placeholder="Tahun" /></SelectTrigger>
                                    <SelectContent>{years.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
                                </Select>
                                <Select value={levelFilter} onValueChange={(v) => setLevelFilter(v as any)}>
                                    <SelectTrigger className="w-auto text-xs h-8"><SelectValue placeholder="Tingkat" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        <SelectItem value="7">Kelas 7</SelectItem>
                                        <SelectItem value="8">Kelas 8</SelectItem>
                                        <SelectItem value="9">Kelas 9</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={classRanking} margin={{ top: 5, right: 20, left: -10, bottom: 50 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="className" angle={-45} textAnchor="end" interval={0} />
                                    <YAxis />
                                    <Tooltip content={<CustomClassTooltip />} cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }} />
                                    <Bar dataKey="total">
                                        {classRanking.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-2">
                        <CardHeader><CardTitle>Tabel Peringkat Kelas</CardTitle></CardHeader>
                        <CardContent>
                            <div className="relative overflow-y-auto h-96">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-background z-10">
                                        <TableRow>
                                            <TableHead className="w-16 text-center">Peringkat</TableHead>
                                            <TableHead>Kelas</TableHead>
                                            <TableHead className="text-right">Total Sampah</TableHead>
                                            <TableHead className="text-right">Total Pendapatan</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {classRanking.length === 0 ? (
                                            <TableRow><TableCell colSpan={4} className="text-center h-32">Belum ada data</TableCell></TableRow>
                                        ) : (
                                            classRanking.map((c, idx) => (
                                                <TableRow key={c.className} className="hover:bg-muted/50">
                                                    <TableCell className="text-center font-medium">{idx + 1}</TableCell>
                                                    <TableCell>{c.className}</TableCell>
                                                    <TableCell className="text-right">{Number(c.total || 0).toFixed(2)} kg</TableCell>
                                                    <TableCell className="text-right">Rp {Number(c.totalValue || 0).toLocaleString('id-ID')}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Guru Ranking Section */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                    <Card className="lg:col-span-3">
                        <CardHeader><CardTitle>Diagram Peringkat Guru</CardTitle></CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={guruRanking} margin={{ top: 5, right: 20, left: -10, bottom: 50 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="guruName" angle={-45} textAnchor="end" interval={0} />
                                    <YAxis />
                                    <Tooltip content={<CustomGuruTooltip />} cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }} />
                                    <Bar dataKey="totalKg">
                                        {guruRanking.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-2">
                        <CardHeader><CardTitle>Tabel Peringkat Guru</CardTitle></CardHeader>
                        <CardContent>
                            <div className="relative overflow-y-auto h-96">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-background z-10">
                                        <TableRow>
                                            <TableHead className="w-16 text-center">Peringkat</TableHead>
                                            <TableHead>Nama Guru</TableHead>
                                            <TableHead className="text-right">Total Sampah</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {guruRanking.length === 0 ? (
                                            <TableRow><TableCell colSpan={3} className="text-center h-32">Belum ada data</TableCell></TableRow>
                                        ) : (
                                            guruRanking.map((g, idx) => (
                                                <TableRow key={g.guruName} className="hover:bg-muted/50">
                                                    <TableCell className="text-center font-medium">{idx + 1}</TableCell>
                                                    <TableCell>{g.guruName}</TableCell>
                                                    <TableCell className="text-right">{Number(g.totalKg || 0).toFixed(2)} kg</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}