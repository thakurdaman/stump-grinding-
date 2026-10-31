import { NextResponse } from 'next/server';
import { SITE_CONFIG } from '@/config/site';

export async function POST(req: Request) {
  try {
    const { name, email, message, honeypot } = await req.json();

    // Spam protection: honeypot field
    if (honeypot && honeypot.length > 0) {
      // Silently return success to fool bots
      return NextResponse.json({ success: true, message: 'Message sent.' });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are all required.' },
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

    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Message cannot exceed 5,000 characters.' },
        { status: 400 }
      );
    }

    // In production with Resend:
    if (process.env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: `${SITE_CONFIG.name} Helpdesk <contact@${new URL(SITE_CONFIG.url).hostname}>`,
          to: [SITE_CONFIG.supportEmail],
          reply_to: email,
          subject: `Contact Form Inquiry from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        }),
      });
    } else {
      console.log('\n--- [CONTACT FORM SUBMISSION] ---');
      console.log(`From: ${name} <${email}>`);
      console.log(`Message: ${message}`);
      console.log('---------------------------------\n');
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out. We will get back to you within 24 hours.',
    });
  } catch (err: any) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
