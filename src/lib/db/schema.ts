export * from './schema/index';
import {
    pgTable,
    text,
    timestamp,
    varchar,
    integer,
    serial,
    uniqueIndex,
    decimal,
} from 'drizzle-orm/pg-core';

// `curriculums` should map to the SQL table named `curriculums`.
export const curriculums = pgTable('curriculums', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    pdfUrl: text('pdf_url').notNull(),
    category: text('category').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const kelas = pgTable(
    'kelas',
    {
        id: serial('id').primaryKey(),
        tingkat: integer('tingkat').notNull(),
        huruf: varchar('huruf', { length: 1 }).notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at').defaultNow().notNull(),
    },
    (table) => {
        return {
            unq: uniqueIndex('unique_kelas').on(table.tingkat, table.huruf),
        };
    },
);

export const jenisSampah = pgTable('jenis_sampah', {
    id: serial('id').primaryKey(),
    namaSampah: varchar('nama_sampah', { length: 255 }).notNull(),
    hargaPerKg: decimal('harga_per_kg', { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sampahKelas = pgTable('sampah_kelas', {
    id: serial('id').primaryKey(),
    kelasId: integer('kelas_id')
        .notNull()
        .references(() => kelas.id, { onDelete: 'cascade' }),
    jenisSampahId: integer('jenis_sampah_id')
        .notNull()
        .references(() => jenisSampah.id, { onDelete: 'cascade' }),
    jumlahKg: decimal('jumlah_kg', { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const guruSispendik = pgTable('guru_sispendik', {
    id: serial('id').primaryKey(),
    namaGuru: varchar('nama_guru', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const setoranGuru = pgTable('setoran_guru', {
    id: serial('id').primaryKey(),
    guruId: integer('guru_id')
        .notNull()
        .references(() => guruSispendik.id, { onDelete: 'cascade' }),
    jenisSampahId: integer('jenis_sampah_id')
        .notNull()
        .references(() => jenisSampah.id, { onDelete: 'cascade' }),
    jumlahKg: decimal('jumlah_kg', { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
