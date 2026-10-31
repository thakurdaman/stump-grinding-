import { NextResponse } from 'next/server';
import { resendOrderLinks } from '@/lib/orders';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email address is required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const result = await resendOrderLinks(email);

    // Return success message even if email wasn't found to prevent user enumeration attacks
    return NextResponse.json({
      success: true,
      message: 'If an active order was found for that email address, fresh download links have been sent to your inbox.',
      found: result.success,
    });
  } catch (error: any) {
    console.error('Resend Links API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again or contact support.' },
      { status: 500 }
    );
  }
}
