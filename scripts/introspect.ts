import 'dotenv/config';
import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function introspectDatabase() {
    console.log('Connecting to the database to get table list...');
    try {
        // Query to get all table names from the public schema
        const result = await db.execute(sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public';`);

        console.log('\n--- Tables Found in Database ---');
        const tableNames = result.rows.map((r: any) => r.tablename);
        console.log(tableNames.join('\n'));
        console.log('--------------------------------\n');

        console.log('Please copy the list of tables above and paste it back to me.');
        process.exit(0);
    } catch (error) {
        console.error('Error during database introspection:', error);
        process.exit(1);
    }
}

introspectDatabase();
