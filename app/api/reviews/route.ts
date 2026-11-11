import { NextRequest, NextResponse } from 'next/server';
import { SITE_CONFIG } from '@/config/site';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, role, location, equipment, rating, highlight, quote, honeypot } = body;

    // Spam protection: silent drop if bot filled the honeypot
    if (honeypot && String(honeypot).length > 0) {
      return NextResponse.json({ success: true, message: 'Review received.' });
    }

    if (!name || !quote || !highlight) {
      return NextResponse.json(
        { error: 'Name, review summary, and detailed review are required.' },
        { status: 400 }
      );
    }

    const review = {
      id: `rev-${Date.now()}`,
      name: String(name).slice(0, 80),
      role: role ? String(role).slice(0, 100) : 'Verified Buyer',
      location: location ? String(location).slice(0, 60) : 'United States',
      equipment: equipment ? String(equipment).slice(0, 80) : 'Commercial Grinder',
      rating: Number(rating) >= 1 && Number(rating) <= 5 ? Number(rating) : 5,
      highlight: String(highlight).slice(0, 150),
      quote: String(quote).slice(0, 1000),
      verifiedOperator: false,
      createdAt: new Date().toISOString(),
    };

    console.log('[REVIEW_SUBMITTED]', review);

    // Forward review notification to owner if Resend is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const supportFromEmail = `${SITE_CONFIG.name} <support@${new URL(SITE_CONFIG.url).hostname}>`;
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
            from: supportFromEmail,
            to: [recipientEmail],
            subject: `New Operator Review: ${review.name} (${review.rating} Stars)`,
            text: `A new customer review was submitted on ${SITE_CONFIG.name}:\n\n` +
                  `Name: ${review.name}\n` +
                  `Role: ${review.role}\n` +
                  `Location: ${review.location}\n` +
                  `Equipment: ${review.equipment}\n` +
                  `Rating: ${review.rating} / 5\n` +
                  `Headline: "${review.highlight}"\n\n` +
                  `Review:\n${review.quote}\n\n` +
                  `Submitted at: ${review.createdAt}`,
          }),
        });
      } catch (emailErr) {
        console.error('Failed to forward review notification email:', emailErr);
      }
    }

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (err: unknown) {
    console.error('Error submitting review:', err);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
