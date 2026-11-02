import { NextRequest, NextResponse } from 'next/server';
import { 
  verifyEmail, 
  sendVerificationCode, 
  checkVerificationCode 
} from '@/lib/email-verifier';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email') || '';

  const result = await verifyEmail(email);
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email = '', action, code } = body;

    if (action === 'send-code') {
      const res = await sendVerificationCode(email);
      return NextResponse.json(res);
    }

    if (action === 'check-code') {
      const res = checkVerificationCode(email, code);
      return NextResponse.json(res);
    }

    // Default pre-check
    const result = await verifyEmail(email);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { valid: false, deliverable: false, reason: 'Invalid request body.' },
      { status: 400 }
    );
  }
}
