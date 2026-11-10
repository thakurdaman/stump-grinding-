const { execSync } = require('child_process');

const directUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL || '';

if (directUrl && !directUrl.includes('localhost') && (directUrl.startsWith('postgres://') || directUrl.startsWith('postgresql://'))) {
  console.log('Connecting to cloud PostgreSQL database and pushing Prisma schema...');
  try {
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('Enabling Row Level Security (RLS) on public schema tables...');
    execSync(`npx prisma db execute --file ./scripts/enable-rls.sql --url "${directUrl}"`, { stdio: 'inherit' });
    console.log('Row Level Security (RLS) successfully applied.');
  } catch (err) {
    console.warn('Prisma db push warning:', err.message);
  }
} else {
  console.log('Local/placeholder database detected. Skipping cloud schema push.');
}
