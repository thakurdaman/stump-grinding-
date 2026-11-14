import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  const expectedKey = process.env.ADMIN_SECRET_KEY;

  if (!expectedKey) {
    return NextResponse.json({ error: 'ADMIN_SECRET_KEY not configured.' }, { status: 500 });
  }

  const expectedHeader = `Bearer ${expectedKey}`;
  if (
    !authHeader ||
    authHeader.length !== expectedHeader.length ||
    !crypto.timingSafeEqual(Buffer.from(authHeader), Buffer.from(expectedHeader))
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') || 'json';

  const leads = await db.lead.findMany({
    orderBy: { createdAt: 'desc' },
  });

  if (format === 'csv') {
    const sanitizeCsvField = (val: string) => {
      let clean = String(val ?? '').replace(/"/g, '""');
      if (/^[=+\-@]/.test(clean)) clean = `'${clean}`;
      return `"${clean}"`;
    };

    let csv = 'Email,Source,Created At\n';
    for (const lead of leads) {
      csv += `${sanitizeCsvField(lead.email)},${sanitizeCsvField(lead.source)},${sanitizeCsvField(lead.createdAt.toISOString())}\n`;
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
