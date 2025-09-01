import { db } from '../src/lib/db';
import { users } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

async function main() {
    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
        console.error('Error: Please provide an email and a password.');
        console.log('Usage: npx tsx scripts/manage-admin.ts <email> <password>');
        process.exit(1);
    }

    console.log(`Processing admin account for: ${email}`)

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully.');

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser) {
            console.log('User with this email already exists. Updating password...');
            await db
                .update(users)
                .set({ password: hashedPassword })
                .where(eq(users.id, existingUser.id));
            console.log(`✅ Password for ${email} has been updated successfully.`)
        } else {
            console.log('Creating new user...');
            await db.insert(users).values({
                id: `user_${Date.now()}`,
                email: email,
                password: hashedPassword,
                name: email.split('@')[0], // Use part of email as name
            });
            console.log(`✅ Admin user ${email} created successfully.`);
        }

    } catch (error) {
        console.error('An error occurred:', error);
        process.exit(1);
    }

    process.exit(0);
}

main();
