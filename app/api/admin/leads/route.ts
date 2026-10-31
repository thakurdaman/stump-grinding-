import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  const expectedKey = process.env.ADMIN_SECRET_KEY || 'stump-admin-secret-change-in-production';

  if (!authHeader || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') || 'json';

  const leads = await db.lead.findMany({
    orderBy: { createdAt: 'desc' },
  });

  if (format === 'csv') {
    let csv = 'Email,Source,Created At\n';
    for (const lead of leads) {
      csv += `"${lead.email}","${lead.source}","${lead.createdAt.toISOString()}"\n`;
    }
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="stump-grinding-leads.csv"',
      },
    });
  }

  return NextResponse.json({ count: leads.length, leads });
}
