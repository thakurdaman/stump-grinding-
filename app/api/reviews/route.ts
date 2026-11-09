import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, role, location, equipment, rating, highlight, quote } = body;

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

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (err: unknown) {
    console.error('Error submitting review:', err);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
