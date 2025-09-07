import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const [userId] = process.argv.slice(2);

async function main() {
    if (!userId) {
        console.error('Usage: tsx scripts/delete-admin.ts <user_id>');
        process.exit(1);
    }

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    if (!user) {
        console.error(`User with ID ${userId} not found.`);
        process.exit(1);
    }

    await db.delete(users).where(eq(users.id, userId));

    console.log(
        `User with ID ${userId} and email ${user.email} has been deleted.`,
    );
}

main().catch((error) => {
    console.error('An error occurred:', error);
    process.exit(1);
});
