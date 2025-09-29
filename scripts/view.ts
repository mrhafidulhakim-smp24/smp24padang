import { db } from '@/lib/db';

async function main() {
    const allUsers = await db.query.users.findMany({
        columns: {
            id: true,
            name: true,
            email: true,
            password: true,
        },
    });

    if (allUsers.length === 0) {
        console.log('No users found in the database.');
        return;
    }

    console.log('List of all users:');
    console.table(allUsers);
}

main().catch((error) => {
    console.error('An error occurred:', error);
    process.exit(1);
});
