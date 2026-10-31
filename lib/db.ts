import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// On Vercel serverless lambdas, the root filesystem is read-only.
// We copy the seeded SQLite file into /tmp which has full read-write permissions.
let databaseUrl: string | undefined = undefined;

if (process.env.VERCEL) {
  const tmpDbPath = '/tmp/dev.db';
  if (!fs.existsSync(tmpDbPath)) {
    const localDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    if (fs.existsSync(localDbPath)) {
      try {
        fs.copyFileSync(localDbPath, tmpDbPath);
      } catch (e) {
        console.error('Failed to copy database to /tmp:', e);
      }
    }
  }
  databaseUrl = 'file:/tmp/dev.db';
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: databaseUrl ? { db: { url: databaseUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
