
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const [action, name, email, password] = process.argv.slice(2);

async function main() {
  if (action === 'create') {
    if (!name || !email || !password) {
      console.error('Usage: tsx scripts/manage-admin.ts create <name> <email> <password>');
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = randomUUID();

    await db.insert(users).values({
      id: userId,
      name: name,
      email: email,
      password: hashedPassword,
    });

    console.log(`Admin user ${name} (${email}) created successfully.`);
  } else if (action === 'update-password') {
    if (!email || !password) {
      console.error('Usage: tsx scripts/manage-admin.ts update-password <email> <new_password>');
      process.exit(1);
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      console.error(`User with email ${email} not found.`);
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, user.id));

    console.log(`Password for user ${email} updated successfully.`);
  } else {
    console.error('Invalid action. Use "create" or "update-password".');
    console.log('To create a new admin: tsx scripts/manage-admin.ts create <name> <email> <password>');
    console.log('To update a password: tsx scripts/manage-admin.ts update-password <email> <new_password>');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});
