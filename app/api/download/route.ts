import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import { validateToken } from '@/lib/orders';
import { isFileAllowedForProduct } from '@/config/products';
import { stampPdfWithBuyerEmail } from '@/lib/stamper';

export const dynamic = 'force-dynamic';

const MIME_MAP: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const filename = searchParams.get('file');

    if (!token || !filename) {
      return NextResponse.json(
        { error: 'Missing token or filename parameter.' },
        { status: 400 }
      );
    }

    // Sanitize filename to prevent directory traversal
    const safeFilename = path.basename(filename);
    if (safeFilename !== filename || filename.includes('..')) {
      return NextResponse.json({ error: 'Invalid file parameter.' }, { status: 400 });
    }

    // Validate the token and order
    const tokenResult = await validateToken(token);
    if (!tokenResult.success) {
      if (tokenResult.error === 'expired') {
        return NextResponse.json(
          {
            error: 'This download link has expired (7-day validity). Visit /resend-links to receive a fresh link.',
            expired: true,
          },
          { status: 410 }
        );
      }
      return NextResponse.json(
        { error: 'Invalid or revoked download link.' },
        { status: 403 }
      );
    }

    const order = tokenResult.order;

    // Check version entitlement: Each version delivers ONLY its own files
    const isAllowed = isFileAllowedForProduct(order.versionId, safeFilename);
    if (!isAllowed) {
      return NextResponse.json(
        {
          error: `The requested file is not included in the "${order.productName}" tier.`,
        },
        { status: 403 }
      );
    }

    // Check rate limit per order (max 10 downloads per file per token)
    const specificFileDownloads = await db.downloadLog.count({
      where: { orderId: order.id, filename: safeFilename },
    });

    if (specificFileDownloads >= 10) {
      return NextResponse.json(
        {
          error: 'Download limit exceeded for this link (maximum 10 downloads per file). Please visit /resend-links to issue a fresh link.',
        },
        { status: 429 }
      );
    }

    // Locate physical file in private-files
    const privateDir = path.join(process.cwd(), 'private-files');
    const filePath = path.join(privateDir, safeFilename);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File temporarily unavailable. Please contact support.' },
        { status: 404 }
      );
    }

    // Log the download event
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    await db.$transaction([
      db.order.update({
        where: { id: order.id },
        data: { downloadCount: { increment: 1 } },
      }),
      db.downloadLog.create({
        data: {
          orderId: order.id,
          filename: safeFilename,
          ipAddress: clientIp,
        },
      }),
    ]);

    const ext = path.extname(safeFilename).toLowerCase();
    const contentType = MIME_MAP[ext] || 'application/octet-stream';

    // Optional PDF stamping
    const shouldStamp = process.env.STAMP_PDF === 'true';
    if (ext === '.pdf' && shouldStamp) {
      try {
        const stampedBytes = await stampPdfWithBuyerEmail(filePath, order.email);
        return new NextResponse(Buffer.from(stampedBytes), {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${safeFilename}"`,
            'Content-Length': String(stampedBytes.byteLength),
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        });
      } catch (stampErr) {
        console.error('PDF stamp failed, serving original file:', stampErr);
      }
    }

    // Stream the raw file
    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Content-Length': String(fileBuffer.length),
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('Download API error:', error);
    return NextResponse.json({ error: 'Download failed.' }, { status: 500 });
  }
}
