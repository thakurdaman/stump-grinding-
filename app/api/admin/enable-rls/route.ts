import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token') || req.headers.get('x-fix-token');
  
  if (token !== 'rls-fix-stump-grinding-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await db.$executeRawUnsafe(`ALTER TABLE public."Order" ENABLE ROW LEVEL SECURITY;`);
    await db.$executeRawUnsafe(`ALTER TABLE public."Lead" ENABLE ROW LEVEL SECURITY;`);
    await db.$executeRawUnsafe(`ALTER TABLE public."DownloadLog" ENABLE ROW LEVEL SECURITY;`);

    const status: any[] = await db.$queryRawUnsafe(`
      SELECT relname, relrowsecurity 
      FROM pg_class 
      JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
      WHERE nspname = 'public' AND relname IN ('Order', 'Lead', 'DownloadLog');
    `);

    return NextResponse.json({
      success: true,
      message: 'Row Level Security successfully enabled on all 3 tables.',
      tables: status,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || String(error),
    }, { status: 500 });
  }
}
