
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import {
    guruSispendik,
    jenisSampah as jenisSampahTable,
} from '@/lib/db/schema';

// Create Zod schemas from Drizzle tables
export const JenisSampahSchema = createSelectSchema(jenisSampahTable);
export const GuruSchema = createSelectSchema(guruSispendik);

// --- TYPE DEFINITIONS ---
export type JenisSampah = z.infer<typeof JenisSampahSchema>;
export type Guru = z.infer<typeof GuruSchema>;

export interface Kelas {
    id: number;
    tingkat: number;
    huruf: string;
}

export interface SetoranEntry {
    id: number;
    jenisSampah: string;
    jenisSampahId: number;
    jumlahKg: string | number;
    hargaPerKg: string | number;
    createdAt: string | Date | null;
}

export interface SetoranGuruEntry {
    id: number;
    guruId: number | null;
    jumlahKg: string;
    createdAt: Date;
    guru: string | null;
    jenisSampahId: number | null;
    jenisSampah: string | null;
    hargaPerKg: string | null;
}

export interface SispendikClientProps {
    kelas: Kelas[];
    jenisSampah: JenisSampah[];
    gurus: Guru[];
    initialSetoranGuru: SetoranGuruEntry[];
}
