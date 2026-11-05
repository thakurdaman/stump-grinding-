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
      const fromEmail =
        process.env.RESEND_FROM_EMAIL ||
        `${SITE_CONFIG.name} <orders@${new URL(SITE_CONFIG.url).hostname}>`;
      const recipientEmail =
        process.env.CONTACT_RECIPIENT_EMAIL ||
        process.env.SUPPORT_EMAIL ||
        'damanthakur2016@gmail.com';

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [recipientEmail],
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
