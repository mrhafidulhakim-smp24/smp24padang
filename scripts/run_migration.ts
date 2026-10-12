import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
async function run() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        console.log('Connected.');
        const migrations = [
            'drizzle/manual/0031_sispendig_safe_enhancements.sql',
            'drizzle/manual/0033_rename_legacy_guru_table.sql',
        ];
        for (const migration of migrations) {
            await client.query(fs.readFileSync(migration, 'utf-8'));
        }
        console.log('Success.');
    } catch (e) { console.error(e); } finally { await client.end(); }
}
run();
