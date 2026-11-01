const { execSync } = require('child_process');

const url = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL || '';

if (url && !url.includes('localhost') && (url.startsWith('postgres://') || url.startsWith('postgresql://'))) {
  console.log('Connecting to cloud PostgreSQL database and pushing Prisma schema...');
  try {
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  } catch (err) {
    console.warn('Prisma db push warning:', err.message);
  }
} else {
  console.log('Local/placeholder database detected. Skipping cloud schema push.');
}
