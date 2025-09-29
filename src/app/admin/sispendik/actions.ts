'use server';
// @ts-nocheck

import { db } from '@/lib/db';
import { kelas, jenisSampah, sampahKelas } from '@/lib/db/types';
import { desc, eq, and, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

async function ensureKelasSeeded() {
    const any = await db.select({ id: kelas.id }).from(kelas).limit(1);
    if (any.length === 0) {
        const kelasData = [] as { tingkat: number; huruf: string }[];
        for (const tingkat of [7, 8, 9]) {
            for (const huruf of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']) {
                kelasData.push({ tingkat, huruf });
            }
        }
        await db.insert(kelas).values(kelasData);
    }
}

// Kelas Actions
export async function getAllKelas() {
    try {
        await ensureKelasSeeded();
        const data = await db
            .select()
            .from(kelas)
            .orderBy(kelas.tingkat, kelas.huruf);
        return { data };
    } catch (error) {
        return { error: 'Failed to fetch kelas data' };
    }
}

// Jenis Sampah Actions
export async function getAllJenisSampah() {
    try {
        const data = await db
            .select()
            .from(jenisSampah)
            .orderBy(jenisSampah.namaSampah);
        return { data };
    } catch (error) {
        return { error: 'Failed to fetch jenis sampah data' };
    }
}

export async function createJenisSampah(data: {
    namaSampah: string;
    hargaPerKg: number;
}) {
    try {
        await db.insert(jenisSampah).values({
            namaSampah: data.namaSampah,
            hargaPerKg: data.hargaPerKg.toFixed(2),
        });
        revalidatePath('/admin/sispendik');
        return { success: true };
    } catch (error) {
        return { error: 'Failed to create jenis sampah' };
    }
}

export async function updateJenisSampah(
    id: number,
    data: {
        namaSampah: string;
        hargaPerKg: number;
    },
) {
    try {
        await db
            .update(jenisSampah)
            .set({
                namaSampah: data.namaSampah,
                hargaPerKg: data.hargaPerKg.toFixed(2),
                updatedAt: new Date(),
            })
            .where(eq(jenisSampah.id, id));
        revalidatePath('/admin/sispendik');
        return { success: true };
    } catch (error) {
        return { error: 'Failed to update jenis sampah' };
    }
}

export async function deleteJenisSampah(id: number) {
    try {
        await db.delete(jenisSampah).where(eq(jenisSampah.id, id));
        revalidatePath('/admin/sispendik');
        return { success: true };
    } catch (error) {
        return { error: 'Failed to delete jenis sampah' };
    }
}

export async function resetClassDeposits(kelasId: number) {
    try {
        await db.delete(sampahKelas).where(eq(sampahKelas.kelasId, kelasId));
        revalidatePath('/admin/sispendik');
        revalidatePath('/sispendik');
        return { success: true };
    } catch (error) {
        return { error: 'Failed to reset class deposits' };
    }
}

export async function resetClassDepositsByMonth(
    kelasId: number,
    month: number,
    year: number,
) {
    try {
        await db
            .delete(sampahKelas)
            .where(
                and(
                    eq(sampahKelas.kelasId, kelasId),
                    sql`EXTRACT(MONTH FROM ${sampahKelas.createdAt}) = ${month}`,
                    sql`EXTRACT(YEAR FROM ${sampahKelas.createdAt}) = ${year}`,
                ),
            );
        revalidatePath('/admin/sispendik');
        revalidatePath('/sispendik');
        return { success: true };
    } catch (error) {
        return { error: 'Failed to reset class deposits for month' };
    }
}

export async function deleteSampahKelasRecord(id: number) {
    try {
        await db.delete(sampahKelas).where(eq(sampahKelas.id, id));
        revalidatePath('/admin/sispendik');
        revalidatePath('/sispendik');
        return { success: true };
    } catch (error) {
        return { error: 'Failed to delete sampah kelas record' };
    }
}

// Sampah Kelas Actions
export async function createSampahKelas(data: {
    kelasId: number;
    jenisSampahId: number;
    jumlahKg: number;
}) {
    try {
        await db.insert(sampahKelas).values({
            kelasId: data.kelasId,
            jenisSampahId: data.jenisSampahId,
            jumlahKg: data.jumlahKg.toString(),
        });
        revalidatePath('/admin/sispendik');
        revalidatePath('/sispendik');
        return { success: true };
    } catch (error) {
        return { error: 'Failed to create sampah kelas record' };
    }
}

export async function updateSampahKelas(
    id: number,
    data: { jenisSampahId: number; jumlahKg: number },
) {
    try {
        await db
            .update(sampahKelas)
            .set({
                jenisSampahId: data.jenisSampahId,
                jumlahKg: data.jumlahKg.toString(),
            })
            .where(eq(sampahKelas.id, id));
        revalidatePath('/admin/sispendik');
        revalidatePath('/sispendik');
        return { success: true };
    } catch (error) {
        return { error: 'Failed to update sampah kelas record' };
    }
}

export async function getSampahKelasByKelas(kelasId: number) {
    try {
        const data = await db
            .select({
                id: sampahKelas.id,
                jumlahKg: sampahKelas.jumlahKg,
                jenisSampah: jenisSampah.namaSampah,
                hargaPerKg: jenisSampah.hargaPerKg,
                createdAt: sampahKelas.createdAt,
            })
            .from(sampahKelas)
            .innerJoin(
                jenisSampah,
                eq(sampahKelas.jenisSampahId, jenisSampah.id),
            )
            .where(eq(sampahKelas.kelasId, kelasId))
            .orderBy(desc(sampahKelas.createdAt));
        return { data };
    } catch (error) {
        return { error: 'Failed to fetch sampah kelas data' };
    }
}

export async function getSampahKelasByKelasMonth(
    kelasId: number,
    month: number,
    year: number,
) {
    try {
        const data = await db
            .select({
                id: sampahKelas.id,
                jumlahKg: sampahKelas.jumlahKg,
                jenisSampah: jenisSampah.namaSampah,
                jenisSampahId: jenisSampah.id,
                hargaPerKg: jenisSampah.hargaPerKg,
                createdAt: sampahKelas.createdAt,
            })
            .from(sampahKelas)
            .innerJoin(
                jenisSampah,
                eq(sampahKelas.jenisSampahId, jenisSampah.id),
            )
            .where(
                and(
                    eq(sampahKelas.kelasId, kelasId),
                    sql`EXTRACT(MONTH FROM ${sampahKelas.createdAt}) = ${month}`,
                    sql`EXTRACT(YEAR FROM ${sampahKelas.createdAt}) = ${year}`,
                ),
            )
            .orderBy(desc(sampahKelas.createdAt));
        return { data };
    } catch (error) {
        return { error: 'Failed to fetch sampah kelas data (filtered)' };
    }
}

// Dashboard Data Actions
export type AggregatedData = {
    wasteType: string;
    amount: number;
    month: string;
    year: number;
};

export async function getAggregatedData(month: number, year: number) {
    try {
        const data = await db
            .select({
                wasteType: jenisSampah.namaSampah,
                amount: sql<number>`SUM(${sampahKelas.jumlahKg})`,
                month: sql<string>`TO_CHAR(${sampahKelas.createdAt}, 'Month')`,
                year: sql<number>`EXTRACT(YEAR FROM ${sampahKelas.createdAt})`,
            })
            .from(sampahKelas)
            .innerJoin(
                jenisSampah,
                eq(sampahKelas.jenisSampahId, jenisSampah.id),
            )
            .where(
                and(
                    sql`EXTRACT(MONTH FROM ${sampahKelas.createdAt}) = ${month}`,
                    sql`EXTRACT(YEAR FROM ${sampahKelas.createdAt}) = ${year}`,
                ),
            )
            .groupBy(
                jenisSampah.namaSampah,
                sql`TO_CHAR(${sampahKelas.createdAt}, 'Month')`,
                sql`EXTRACT(YEAR FROM ${sampahKelas.createdAt})`,
            );
        return { data };
    } catch (error) {
        return { error: 'Failed to fetch aggregated data' };
    }
}

export async function getClassRanking(month: number, year: number) {
    try {
        const data = await db
            .select({
                className: sql<string>`CONCAT(${kelas.tingkat}, ${kelas.huruf})`,
                total: sql<number>`SUM(${sampahKelas.jumlahKg})`,
                totalValue: sql<number>`COALESCE(SUM(CAST(${sampahKelas.jumlahKg} AS numeric) * CAST(${jenisSampah.hargaPerKg} AS numeric)), 0)`,
                jenisList: sql<string>`STRING_AGG(DISTINCT ${jenisSampah.namaSampah}, ', ')`,
            })
            .from(sampahKelas)
            .innerJoin(kelas, eq(sampahKelas.kelasId, kelas.id))
            .innerJoin(jenisSampah, eq(sampahKelas.jenisSampahId, jenisSampah.id))
            .where(
                and(
                    sql`EXTRACT(MONTH FROM ${sampahKelas.createdAt}) = ${month}`,
                    sql`EXTRACT(YEAR FROM ${sampahKelas.createdAt}) = ${year}`,
                ),
            )
            .groupBy(kelas.tingkat, kelas.huruf)
            .orderBy(desc(sql<number>`SUM(${sampahKelas.jumlahKg})`));
        return { data };
    } catch (error) {
        return { error: 'Failed to fetch class ranking' };
    }
}

export async function getClassTotals(month: number, year: number) {
    try {
        await ensureKelasSeeded();
        // Left join kelas with sampah_kelas and jenis_sampah to get totals per class.
        // Apply month/year filter in the JOIN condition to preserve classes without data.
        const data = await db
            .select({
                kelasId: kelas.id,
                tingkat: kelas.tingkat,
                huruf: kelas.huruf,
                total: sql<number>`COALESCE(SUM(${sampahKelas.jumlahKg}), 0)`,
                totalValue: sql<number>`COALESCE(SUM(CAST(${sampahKelas.jumlahKg} AS numeric) * CAST(${jenisSampah.hargaPerKg} AS numeric)), 0)`,
                jenisList: sql<string>`STRING_AGG(DISTINCT ${jenisSampah.namaSampah}, ', ')`,
            })
            .from(kelas)
            .leftJoin(
                sampahKelas,
                and(
                    eq(sampahKelas.kelasId, kelas.id),
                    sql`EXTRACT(MONTH FROM ${sampahKelas.createdAt}) = ${month}`,
                    sql`EXTRACT(YEAR FROM ${sampahKelas.createdAt}) = ${year}`,
                ),
            )
            .leftJoin(
                jenisSampah,
                eq(sampahKelas.jenisSampahId, jenisSampah.id),
            )
            .groupBy(kelas.id, kelas.tingkat, kelas.huruf)
            .orderBy(kelas.tingkat, kelas.huruf);

        return { data };
    } catch (error) {
        return { error: 'Failed to fetch class totals' };
    }
}

export async function getTotalsSummary(month: number, year: number) {
    try {
        const data = await db
            .select({
                totalKg: sql<number>`COALESCE(SUM(${sampahKelas.jumlahKg}), 0)`,
                totalValue: sql<number>`COALESCE(SUM(CAST(${sampahKelas.jumlahKg} AS numeric) * CAST(${jenisSampah.hargaPerKg} AS numeric)), 0)`,
            })
            .from(sampahKelas)
            .innerJoin(jenisSampah, eq(sampahKelas.jenisSampahId, jenisSampah.id))
            .where(
                and(
                    sql`EXTRACT(MONTH FROM ${sampahKelas.createdAt}) = ${month}`,
                    sql`EXTRACT(YEAR FROM ${sampahKelas.createdAt}) = ${year}`,
                ),
            );
        // returns array with single row
        const row = (data as any[])[0] || { totalKg: 0, totalValue: 0 };
        return { data: row };
    } catch (error) {
        return { error: 'Failed to fetch totals summary' };
    }
}

export async function getTopWasteTypes(month: number, year: number) {
    try {
        const data = await db
            .select({
                wasteType: jenisSampah.namaSampah,
                totalKg: sql<number>`SUM(${sampahKelas.jumlahKg})`,
                totalValue: sql<number>`COALESCE(SUM(CAST(${sampahKelas.jumlahKg} AS numeric) * CAST(${jenisSampah.hargaPerKg} AS numeric)), 0)`,
            })
            .from(sampahKelas)
            .innerJoin(
                jenisSampah,
                eq(sampahKelas.jenisSampahId, jenisSampah.id),
            )
            .where(
                and(
                    sql`EXTRACT(MONTH FROM ${sampahKelas.createdAt}) = ${month}`,
                    sql`EXTRACT(YEAR FROM ${sampahKelas.createdAt}) = ${year}`,
                ),
            )
            .groupBy(jenisSampah.namaSampah)
            .orderBy(desc(sql<number>`SUM(${sampahKelas.jumlahKg})`))
            .limit(3);
        
        return { data };
    } catch (error) {
        return { error: 'Failed to fetch top waste types' };
    }
}

export async function initializeKelasData() {
    try {
        const kelasData = [] as { tingkat: number; huruf: string }[];
        for (const tingkat of [7, 8, 9]) {
            for (const huruf of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']) {
                kelasData.push({ tingkat, huruf });
            }
        }
        await db.insert(kelas).values(kelasData);
        return { success: true };
    } catch (error) {
        return { error: 'Failed to initialize kelas data' };
    }
}
