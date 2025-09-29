'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
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
} from '@/app/admin/sispendik/actions';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

const MONTHS = [
    'Januari','Februari','Maret','April','Mei','Juni',
    'Juli','Agustus','September','Oktober','November','Desember'
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

type TopWasteType = {
    wasteType: string;
    totalKg: number;
    totalValue: number;
};

type ClassRanking = {
    className: string;
    total: number;
    totalValue: number;
    jenisList: string | null;
};

const CustomTooltip = ({ active, payload, label }: any) => {
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

export default function SispendikClientPage() {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [aggregatedData, setAggregatedData] = useState<AggregatedData[]>([]);
    const [classRanking, setClassRanking] = useState<ClassRanking[]>([]);
    const [totalWaste, setTotalWaste] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [topClasses, setTopClasses] = useState<string[]>([]);
    const [topWasteTypes, setTopWasteTypes] = useState<TopWasteType[]>([]);
    const [levelFilter, setLevelFilter] = useState<'all' | '7' | '8' | '9'>('all');

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    useEffect(() => {
        const fetchData = async () => {
            const [aggData, rankData, summary, topWasteRes] = await Promise.all([
                getAggregatedData(month, year),
                getClassRanking(month, year),
                getTotalsSummary(month, year),
                getTopWasteTypes(month, year),
            ]);

            if (aggData.data) {
                setAggregatedData(aggData.data);
            }

            if (rankData.data) {
                const typedData = rankData.data as ClassRanking[];
                const filteredData = typedData.filter(c => levelFilter === 'all' || c.className.startsWith(levelFilter));
                setClassRanking(filteredData);
                setTopClasses(filteredData.slice(0, 3).map(c => c.className));
            } else {
                setClassRanking([]);
                setTopClasses([]);
            }

            if (summary.data) {
                setTotalIncome(Number(summary.data.totalValue) || 0);
                setTotalWaste(Number(summary.data.totalKg) || 0);
            } else {
                setTotalIncome(0);
                setTotalWaste(0);
            }

            if (topWasteRes.data) {
                setTopWasteTypes(topWasteRes.data as TopWasteType[]);
            } else {
                setTopWasteTypes([]);
            }
        };

        fetchData();
    }, [month, year, levelFilter]);

    return (
        <div className="container mx-auto py-6">
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Bank Sampah Digital
                    </h2>
                    <p className="text-muted-foreground">
                        Pantau data sampah dan peringkat kelas dalam program
                        bank sampah sekolah
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-green-100 dark:bg-green-900">
                        <CardHeader>
                            <CardTitle>Total Sampah Terkumpul</CardTitle>
                            <p className="text-2xl font-bold">
                                {Number(totalWaste || 0).toFixed(2)} kg
                            </p>
                        </CardHeader>
                    </Card>
                    <Card className="bg-green-100 dark:bg-green-900">
                        <CardHeader>
                            <CardTitle>Total Pendapatan</CardTitle>
                            <p className="text-2xl font-bold">
                                Rp {totalIncome.toLocaleString('id-ID')}
                            </p>
                        </CardHeader>
                    </Card>
                    <Card className="bg-green-100 dark:bg-green-900">
                        <CardHeader>
                            <CardTitle>Top 3 Kelas</CardTitle>
                            <div className="text-lg font-bold">
                                {topClasses.length > 0 ? (
                                    topClasses.map((c, i) => <div key={i}>{i + 1}. {c}</div>)
                                ) : (
                                    <p className="text-2xl">-</p>
                                )}
                            </div>
                        </CardHeader>
                    </Card>
                    <Card className="bg-green-100 dark:bg-green-900">
                        <CardHeader>
                            <CardTitle>Top 3 Sampah</CardTitle>
                            <div className="space-y-2 pt-2">
                                {topWasteTypes.length > 0 ? (
                                    topWasteTypes.map((w, i) => (
                                        <div key={i} className="flex justify-between items-baseline">
                                            <p className="font-bold text-sm">{i + 1}. {w.wasteType}</p>
                                            <p className="text-sm text-muted-foreground">Rp {Number(w.totalValue || 0).toLocaleString('id-ID')}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center">-</p>
                                )}
                            </div>
                        </CardHeader>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="lg:col-span-2 lg:self-start">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle>Diagram Batang Peringkat Kelas</CardTitle>
                            <div className="flex items-center space-x-2">
                                <Select value={String(month)} onValueChange={(v) => setMonth(parseInt(v))}>
                                    <SelectTrigger className="w-auto">
                                        <SelectValue placeholder="Pilih bulan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MONTHS.map((m, idx) => (
                                            <SelectItem key={m} value={(idx + 1).toString()}>{m}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={String(year)} onValueChange={(v) => setYear(parseInt(v))}>
                                    <SelectTrigger className="w-auto">
                                        <SelectValue placeholder="Pilih tahun" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((y) => (
                                            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={levelFilter} onValueChange={(v) => setLevelFilter(v as any)}>
                                    <SelectTrigger className="w-auto">
                                        <SelectValue placeholder="Pilih tingkat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Tingkat</SelectItem>
                                        <SelectItem value="7">Kelas 7</SelectItem>
                                        <SelectItem value="8">Kelas 8</SelectItem>
                                        <SelectItem value="9">Kelas 9</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <div className="p-6">
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={classRanking}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="className" angle={-45} textAnchor="end" interval={0} height={60} />
                                        <YAxis />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="total">
                                            {classRanking.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </Card>

                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Peringkat Kelas</CardTitle>
                        </CardHeader>
                        <div className="p-6">
                            <div className="rounded-md border overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-16">
                                                Peringkat
                                            </TableHead>
                                            <TableHead>Kelas</TableHead>
                                            <TableHead>Total Sampah</TableHead>
                                            <TableHead>Total Pendapatan</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {classRanking.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-6">Belum ada data</TableCell>
                                            </TableRow>
                                        ) : (
                                            classRanking.map((c, idx) => (
                                                <TableRow key={c.className}>
                                                    <TableCell>{idx + 1}</TableCell>
                                                    <TableCell>{c.className}</TableCell>
                                                    <TableCell>{Number(c.total || 0).toFixed(2)} kg</TableCell>
                                                    <TableCell>Rp {Number(c.totalValue || 0).toLocaleString('id-ID')}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}