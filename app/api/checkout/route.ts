import { NextResponse } from 'next/server';
import { getProductById } from '@/config/products';
import { getPaymentProvider } from '@/lib/payments';
import { SITE_CONFIG } from '@/config/site';
import { createOrFulfillOrder } from '@/lib/orders';
import { verifyEmail } from '@/lib/email-verifier';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { versionId, email, name } = body;

    if (!versionId || !email) {
      return NextResponse.json(
        { error: 'Version ID and email are required.' },
        { status: 400 }
      );
    }

    // Live verification: RFC syntax, typos, disposable blocker, and DNS MX mail exchange lookup
    const verification = await verifyEmail(email);
    if (!verification.valid) {
      return NextResponse.json(
        {
          error: verification.reason,
          suggestion: verification.suggestion,
          isDisposable: verification.isDisposable,
        },
        { status: 400 }
      );
    }

    const product = getProductById(versionId);
    if (!product) {
      return NextResponse.json(
        { error: 'Invalid product version selected.' },
        { status: 404 }
      );
    }

    const isDemo = process.env.DEMO_MODE === 'true';
    const activeProvider = process.env.PAYMENT_PROVIDER || (isDemo ? 'demo' : 'lemonsqueezy');

    // If demo mode is active, directly fulfill order for friction-free testing
    if (isDemo && (activeProvider === 'demo' || !process.env.LEMONSQUEEZY_API_KEY)) {
      const order = await createOrFulfillOrder({
        email,
        versionId: product.id,
        amount: product.price,
        currency: 'USD',
        provider: 'demo',
        providerOrderId: 'demo_' + Date.now(),
      });

      return NextResponse.json({
        checkoutUrl: `/checkout/success?session_id=${order.providerOrderId}&token=${order.downloadToken}`,
        demo: true,
      });
    }

    const provider = getPaymentProvider(activeProvider);
    const checkoutResult = await provider.createCheckout({
      product,
      customerEmail: email,
      customerName: name,
      successUrl: `${SITE_CONFIG.url}/checkout/success`,
      cancelUrl: `${SITE_CONFIG.url}/#pricing`,
    });

    return NextResponse.json({
      checkoutUrl: checkoutResult.redirectUrl,
      providerOrderId: checkoutResult.providerOrderId,
    });
  } catch (error: any) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate checkout.' },
      { status: 500 }
    );
  }
}
