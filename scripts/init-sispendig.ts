import { db } from '@/lib/db';
import { jenisSampah, kelas } from '@/lib/db/schema';

async function initializeDefaultWasteTypes() {
    try {
        const existingTypes = await db.select().from(jenisSampah);

        if (existingTypes.length === 0) {
            const defaultTypes = [
                { namaSampah: 'Kertas', hargaPerKg: 2000 },
                { namaSampah: 'Plastik', hargaPerKg: 1500 },
                { namaSampah: 'Botol Plastik', hargaPerKg: 2500 },
                { namaSampah: 'Kaleng', hargaPerKg: 3000 },
                { namaSampah: 'Kardus', hargaPerKg: 1800 },
                { namaSampah: 'Logam', hargaPerKg: 5000 },
            ];

            await db.insert(jenisSampah).values(
                defaultTypes.map((type) => ({
                    namaSampah: type.namaSampah,
                    hargaPerKg: type.hargaPerKg.toString(),
                })),
            );
        }

        return { success: true };
    } catch (error) {
        return { error: 'Failed to initialize default waste types' };
    }
}

// Run both initializations
async function initializeDatabase() {
    try {
        // Initialize kelas
        const existingKelas = await db.select().from(kelas);
        if (existingKelas.length === 0) {
            const defaultKelas = [];
            for (let tingkat = 7; tingkat <= 9; tingkat++) {
                for (
                    let huruf = 'A';
                    huruf <= 'F';
                    huruf = String.fromCharCode(huruf.charCodeAt(0) + 1)
                ) {
                    defaultKelas.push({
                        tingkat,
                        huruf,
                    });
                }
            }
            await db.insert(kelas).values(defaultKelas);
        }

        // Initialize waste types
        await initializeDefaultWasteTypes();

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
}

initializeDatabase();
