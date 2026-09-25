'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { setoranGuru, guruSispendik, jenisSampah } from '@/lib/db/schema';
import { eq, desc, and, gte, lt } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

function revalidateSispendik() {
  revalidatePath('/admin/sispendik');
  revalidatePath('/sispendik');
}

function monthRange(year: number, month: number) {
  return { start: new Date(year, month - 1, 1), end: new Date(year, month, 1) };
}

// ================= GURU MASTER ACTIONS =================
const GuruSchema = z.object({
  namaGuru: z.string().trim().min(3, 'Nama guru minimal 3 karakter'),
});

export async function createGuru(input: { namaGuru: string } | FormData | unknown) {
  let namaGuru = '';
  if (input instanceof FormData) {
    namaGuru = String(input.get('namaGuru') ?? '');
  } else if (typeof input === 'object' && input !== null && 'namaGuru' in input) {
    namaGuru = String((input as { namaGuru: unknown }).namaGuru ?? '');
  }

  const parsed = GuruSchema.safeParse({ namaGuru });
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || 'Nama guru tidak valid.',
    };
  }

  try {
    await db.insert(guruSispendik).values({ namaGuru: parsed.data.namaGuru });
    revalidateSispendik();
    return { success: true, message: 'Guru berhasil ditambahkan.' };
  } catch {
    return { success: false, message: 'Gagal menambahkan guru.' };
  }
}

export async function updateGuru(
  id: number,
  input: { namaGuru: string } | FormData | unknown,
) {
  let namaGuru = '';
  if (input instanceof FormData) {
    namaGuru = String(input.get('namaGuru') ?? '');
  } else if (typeof input === 'object' && input !== null && 'namaGuru' in input) {
    namaGuru = String((input as { namaGuru: unknown }).namaGuru ?? '');
  }

  const parsed = GuruSchema.safeParse({ namaGuru });
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || 'Nama guru tidak valid.',
    };
  }

  try {
    await db
      .update(guruSispendik)
      .set({
        namaGuru: parsed.data.namaGuru,
        updatedAt: new Date(),
      })
      .where(eq(guruSispendik.id, id));
    revalidateSispendik();
    return { success: true, message: 'Guru berhasil diperbarui.' };
  } catch {
    return { success: false, message: 'Gagal memperbarui guru.' };
  }
}

export async function deleteGuru(id: number) {
  try {
    await db.delete(guruSispendik).where(eq(guruSispendik.id, id));
    revalidateSispendik();
    return { success: true, message: 'Guru berhasil dihapus.' };
  } catch {
    return { success: false, message: 'Gagal menghapus guru.' };
  }
}

// ================= SETORAN GURU ACTIONS =================
const SetoranGuruSchema = z.object({
  guruId: z.coerce.number().int().positive('Guru harus dipilih'),
  jenisSampahId: z.coerce.number().int().positive('Jenis sampah harus dipilih'),
  jumlahKg: z.coerce.number().positive('Jumlah harus lebih dari 0'),
  createdAt: z.coerce.date().default(() => new Date()),
});

export async function createSetoranGuru(
  input:
    | {
        guruId: number;
        jenisSampahId: number;
        jumlahKg: number;
        createdAt?: Date;
      }
    | FormData
    | unknown,
  formDataMaybe?: FormData,
) {
  let raw: unknown;
  if (formDataMaybe instanceof FormData) {
    raw = {
      guruId: formDataMaybe.get('guruId'),
      jenisSampahId: formDataMaybe.get('jenisSampahId'),
      jumlahKg: formDataMaybe.get('jumlahKg'),
      createdAt: formDataMaybe.get('createdAt'),
    };
  } else if (input instanceof FormData) {
    raw = {
      guruId: input.get('guruId'),
      jenisSampahId: input.get('jenisSampahId'),
      jumlahKg: input.get('jumlahKg'),
      createdAt: input.get('createdAt'),
    };
  } else {
    raw = input;
  }

  const parsed = SetoranGuruSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || 'Data setoran tidak valid.',
    };
  }

  try {
    const [jenis] = await db
      .select({ hargaPerKg: jenisSampah.hargaPerKg })
      .from(jenisSampah)
      .where(eq(jenisSampah.id, parsed.data.jenisSampahId))
      .limit(1);

    if (!jenis) {
      return { success: false, message: 'Jenis sampah tidak ditemukan.' };
    }

    await db.insert(setoranGuru).values({
      guruId: parsed.data.guruId,
      jenisSampahId: parsed.data.jenisSampahId,
      jumlahKg: String(parsed.data.jumlahKg),
      hargaPerKgSnapshot: jenis.hargaPerKg,
      tanggalSetoran: parsed.data.createdAt,
    });

    revalidateSispendik();
    return { success: true, message: 'Berhasil membuat setoran baru.' };
  } catch {
    return { success: false, message: 'Gagal menyimpan ke database.' };
  }
}

export async function updateSetoranGuru(
  id: number,
  data: { jenisSampahId: number; jumlahKg: number },
) {
  const UpdateSchema = z.object({
    jenisSampahId: z.coerce.number().int().positive('Jenis sampah harus dipilih'),
    jumlahKg: z.coerce.number().positive('Jumlah harus lebih dari 0'),
  });

  const parsed = UpdateSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || 'Data setoran tidak valid.',
    };
  }

  try {
    const [existing] = await db
      .select({ jenisSampahId: setoranGuru.jenisSampahId })
      .from(setoranGuru)
      .where(eq(setoranGuru.id, id))
      .limit(1);

    if (!existing) {
      return { success: false, message: 'Setoran tidak ditemukan.' };
    }

    const updateData: {
      jenisSampahId: number;
      jumlahKg: string;
      hargaPerKgSnapshot?: string;
    } = {
      jenisSampahId: parsed.data.jenisSampahId,
      jumlahKg: String(parsed.data.jumlahKg),
    };

    if (existing.jenisSampahId !== parsed.data.jenisSampahId) {
      const [jenis] = await db
        .select({ hargaPerKg: jenisSampah.hargaPerKg })
        .from(jenisSampah)
        .where(eq(jenisSampah.id, parsed.data.jenisSampahId))
        .limit(1);

      if (!jenis) {
        return { success: false, message: 'Jenis sampah tidak ditemukan.' };
      }
      updateData.hargaPerKgSnapshot = jenis.hargaPerKg;
    }

    await db.update(setoranGuru).set(updateData).where(eq(setoranGuru.id, id));
    revalidateSispendik();
    return { success: true, message: 'Berhasil memperbarui setoran.' };
  } catch {
    return { success: false, message: 'Gagal memperbarui di database.' };
  }
}

export async function deleteSetoranGuru(id: number) {
  try {
    await db.delete(setoranGuru).where(eq(setoranGuru.id, id));
    revalidateSispendik();
    return { success: true, message: 'Berhasil menghapus data setoran.' };
  } catch {
    return { success: false, message: 'Gagal menghapus data dari database.' };
  }
}

export async function getSetoranGuru(month: number, year: number) {
  try {
    const { start, end } = monthRange(year, month);
    const data = await db
      .select({
        id: setoranGuru.id,
        guruId: setoranGuru.guruId,
        jumlahKg: setoranGuru.jumlahKg,
        createdAt: setoranGuru.tanggalSetoran,
        guru: guruSispendik.namaGuru,
        jenisSampahId: jenisSampah.id,
        jenisSampah: jenisSampah.namaSampah,
        hargaPerKg: setoranGuru.hargaPerKgSnapshot,
      })
      .from(setoranGuru)
      .leftJoin(guruSispendik, eq(setoranGuru.guruId, guruSispendik.id))
      .leftJoin(jenisSampah, eq(setoranGuru.jenisSampahId, jenisSampah.id))
      .where(
        and(
          gte(setoranGuru.tanggalSetoran, start),
          lt(setoranGuru.tanggalSetoran, end),
        ),
      )
      .orderBy(desc(setoranGuru.tanggalSetoran));

    return { data };
  } catch (error) {
    console.error('Database Error:', error);
    return { error: 'Gagal mengambil data setoran guru.' };
  }
}

export async function getSetoranGuruByGuru(
  guruId: number,
  month: number,
  year: number,
) {
  try {
    const { start, end } = monthRange(year, month);
    const data = await db
      .select({
        id: setoranGuru.id,
        guruId: setoranGuru.guruId,
        jumlahKg: setoranGuru.jumlahKg,
        createdAt: setoranGuru.tanggalSetoran,
        guru: guruSispendik.namaGuru,
        jenisSampahId: setoranGuru.jenisSampahId,
        jenisSampah: jenisSampah.namaSampah,
        hargaPerKg: jenisSampah.hargaPerKg,
      })
      .from(setoranGuru)
      .leftJoin(guruSispendik, eq(setoranGuru.guruId, guruSispendik.id))
      .leftJoin(jenisSampah, eq(setoranGuru.jenisSampahId, jenisSampah.id))
      .where(
        and(
          eq(setoranGuru.guruId, guruId),
          gte(setoranGuru.tanggalSetoran, start),
          lt(setoranGuru.tanggalSetoran, end),
        ),
      )
      .orderBy(desc(setoranGuru.tanggalSetoran));

    return { data };
  } catch (error) {
    console.error('Database Error:', error);
    return { error: 'Gagal mengambil data setoran guru.' };
  }
}
