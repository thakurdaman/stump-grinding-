import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    await db.lead.upsert({
      where: { email: cleanEmail },
      update: {},
      create: {
        email: cleanEmail,
        source: 'pricing_cheat_sheet',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'You have been added! We will send the pricing cheat sheet to your inbox.',
    });
  } catch (err: any) {
    console.error('Lead capture error:', err);
    return NextResponse.json({ error: 'Could not save lead.' }, { status: 500 });
  }
}
