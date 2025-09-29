'use server';

import { db } from '@/lib/db';
import { kelas, jenisSampah, sampahKelas } from '@/lib/db/schema';
import { desc, eq, and, sql } from 'drizzle-orm';

export async function getAggregatedData() {
    try {
        const result = await db
            .select({
                kelasId: sampahKelas.kelasId,
                tingkat: kelas.tingkat,
                huruf: kelas.huruf,
                totalKg: sql<string>`SUM(${sampahKelas.jumlahKg})`,
                totalNilai: sql<string>`SUM(${sampahKelas.jumlahKg} * ${jenisSampah.hargaPerKg})`,
            })
            .from(sampahKelas)
            .leftJoin(kelas, eq(kelas.id, sampahKelas.kelasId))
            .leftJoin(
                jenisSampah,
                eq(jenisSampah.id, sampahKelas.jenisSampahId),
            )
            .groupBy(sampahKelas.kelasId, kelas.tingkat, kelas.huruf)
            .orderBy(
                desc(
                    sql<string>`SUM(${sampahKelas.jumlahKg} * ${jenisSampah.hargaPerKg})`,
                ),
            );

        return { data: result };
    } catch (error) {
        return { error: 'Failed to fetch aggregated data' };
    }
}

export async function getMonthlyStats() {
    try {
        const result = await db
            .select({
                month: sql<string>`DATE_TRUNC('month', ${sampahKelas.createdAt})`,
                totalKg: sql<string>`SUM(${sampahKelas.jumlahKg})`,
                totalNilai: sql<string>`SUM(${sampahKelas.jumlahKg} * ${jenisSampah.hargaPerKg})`,
            })
            .from(sampahKelas)
            .leftJoin(
                jenisSampah,
                eq(jenisSampah.id, sampahKelas.jenisSampahId),
            )
            .groupBy(sql<string>`DATE_TRUNC('month', ${sampahKelas.createdAt})`)
            .orderBy(
                sql<string>`DATE_TRUNC('month', ${sampahKelas.createdAt})`,
            );

        return { data: result };
    } catch (error) {
        return { error: 'Failed to fetch monthly stats' };
    }
}

export async function getWasteTypeSummary() {
    try {
        const result = await db
            .select({
                namaSampah: jenisSampah.namaSampah,
                totalKg: sql<string>`SUM(${sampahKelas.jumlahKg})`,
                totalNilai: sql<string>`SUM(${sampahKelas.jumlahKg} * ${jenisSampah.hargaPerKg})`,
            })
            .from(sampahKelas)
            .leftJoin(
                jenisSampah,
                eq(jenisSampah.id, sampahKelas.jenisSampahId),
            )
            .groupBy(jenisSampah.namaSampah)
            .orderBy(desc(sql<string>`SUM(${sampahKelas.jumlahKg})`));

        return { data: result };
    } catch (error) {
        return { error: 'Failed to fetch waste type summary' };
    }
}
