import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  const neon = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(neon);
  prisma = new PrismaClient({ adapter });
} else {
  if (!globalForPrisma.prisma) {
    const neon = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaNeon(neon);
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  prisma = globalForPrisma.prisma;
}

export default prisma;
