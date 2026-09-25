"use server";

import { and, desc, eq, gte, inArray, lt } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { jenisSampah, setoranMasyarakat } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

const itemSchema = z.object({
  jenisSampahId: z.coerce.number().int().positive("Jenis sampah harus dipilih"),
  jumlahKg: z.coerce.number().positive("Jumlah harus lebih dari 0"),
});

// Satu pengiriman bisa memuat beberapa jenis sampah (nama + tanggal sama).
const setoranMasyarakatSchema = z.object({
  namaPenyetor: z.string().trim().min(2, "Nama penyetor minimal 2 karakter"),
  tanggalSetoran: z.coerce.date(),
  items: z.array(itemSchema).min(1, "Tambahkan minimal satu jenis sampah"),
});

// Edit: satu baris daftar = satu jenis sampah.
const setoranItemUpdateSchema = itemSchema;

function revalidateSispendik() {
  revalidatePath("/admin/sispendik");
  revalidatePath("/sispendik");
}

function monthRange(year: number, month: number) {
  return { start: new Date(year, month - 1, 1), end: new Date(year, month, 1) };
}

export async function getSetoranMasyarakat(month: number, year: number) {
  try {
    const { start, end } = monthRange(year, month);
    const data = await db
      .select({
        id: setoranMasyarakat.id,
        namaPenyetor: setoranMasyarakat.namaPenyetor,
        jenisSampahId: setoranMasyarakat.jenisSampahId,
        jenisSampah: jenisSampah.namaSampah,
        kategori: jenisSampah.kategori,
        jumlahKg: setoranMasyarakat.jumlahKg,
        hargaPerKg: setoranMasyarakat.hargaPerKgSnapshot,
        tanggalSetoran: setoranMasyarakat.tanggalSetoran,
      })
      .from(setoranMasyarakat)
      .innerJoin(
        jenisSampah,
        eq(setoranMasyarakat.jenisSampahId, jenisSampah.id),
      )
      .where(
        and(
          gte(setoranMasyarakat.tanggalSetoran, start),
          lt(setoranMasyarakat.tanggalSetoran, end),
        ),
      )
      .orderBy(desc(setoranMasyarakat.tanggalSetoran));
    return { data };
  } catch {
    return {
      error:
        "Gagal mengambil setoran masyarakat. Pastikan migrasi SISPENDIK sudah dijalankan.",
    };
  }
}

export async function createSetoranMasyarakat(input: unknown) {
  const parsed = setoranMasyarakatSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message || "Data setoran tidak valid.",
    };
  }

  try {
    const { namaPenyetor, tanggalSetoran, items } = parsed.data;

    // Ambil harga semua jenis sampah yang dipakai dalam satu query.
    const ids = [...new Set(items.map((item) => item.jenisSampahId))];
    const jenisList = await db
      .select({ id: jenisSampah.id, hargaPerKg: jenisSampah.hargaPerKg })
      .from(jenisSampah)
      .where(inArray(jenisSampah.id, ids));
    const harga = new Map(
      jenisList.map((jenis) => [jenis.id, jenis.hargaPerKg]),
    );

    const rows = items.map((item) => {
      const hargaPerKg = harga.get(item.jenisSampahId);
      if (hargaPerKg === undefined) return null;
      return {
        namaPenyetor,
        jenisSampahId: item.jenisSampahId,
        jumlahKg: String(item.jumlahKg),
        hargaPerKgSnapshot: hargaPerKg,
        tanggalSetoran,
      };
    });
    if (rows.some((row) => row === null)) {
      return { error: "Jenis sampah tidak ditemukan." };
    }

    await db
      .insert(setoranMasyarakat)
      .values(rows as NonNullable<(typeof rows)[number]>[]);
    revalidateSispendik();
    return { success: true, count: rows.length };
  } catch {
    return { error: "Gagal menyimpan setoran masyarakat." };
  }
}

export async function updateSetoranMasyarakat(id: number, input: unknown) {
  const parsed = setoranItemUpdateSchema.safeParse(input);
  if (!Number.isInteger(id) || id < 1 || !parsed.success) {
    return { error: "Data setoran tidak valid." };
  }

  try {
    const [existing] = await db
      .select({ jenisSampahId: setoranMasyarakat.jenisSampahId })
      .from(setoranMasyarakat)
      .where(eq(setoranMasyarakat.id, id))
      .limit(1);
    if (!existing) return { error: "Setoran tidak ditemukan." };

    const updateData: {
      jenisSampahId: number;
      jumlahKg: string;
      updatedAt: Date;
      hargaPerKgSnapshot?: string;
    } = {
      jenisSampahId: parsed.data.jenisSampahId,
      jumlahKg: String(parsed.data.jumlahKg),
      updatedAt: new Date(),
    };

    if (existing.jenisSampahId !== parsed.data.jenisSampahId) {
      const [jenis] = await db
        .select({ hargaPerKg: jenisSampah.hargaPerKg })
        .from(jenisSampah)
        .where(eq(jenisSampah.id, parsed.data.jenisSampahId))
        .limit(1);
      if (!jenis) return { error: "Jenis sampah tidak ditemukan." };
      updateData.hargaPerKgSnapshot = jenis.hargaPerKg;
    }

    await db
      .update(setoranMasyarakat)
      .set(updateData)
      .where(eq(setoranMasyarakat.id, id));
    revalidateSispendik();
    return { success: true };
  } catch {
    return { error: "Gagal memperbarui setoran masyarakat." };
  }
}

export async function deleteSetoranMasyarakat(id: number) {
  if (!Number.isInteger(id) || id < 1)
    return { error: "ID setoran tidak valid." };
  try {
    await db.delete(setoranMasyarakat).where(eq(setoranMasyarakat.id, id));
    revalidateSispendik();
    return { success: true };
  } catch {
    return { error: "Gagal menghapus setoran masyarakat." };
  }
}
