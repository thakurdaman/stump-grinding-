import { NextResponse } from 'next/server';
import { StripeProvider } from '@/lib/payments/stripe';
import { createOrFulfillOrder } from '@/lib/orders';

export async function POST(req: Request) {
  try {
    const provider = new StripeProvider();
    const result = await provider.verifyWebhook(req);

    if (!result.valid) {
      console.warn('Invalid Stripe webhook:', result.error);
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    if (result.order) {
      await createOrFulfillOrder({
        email: result.order.email,
        versionId: result.order.versionId,
        amount: result.order.amount,
        currency: result.order.currency,
        provider: 'stripe',
        providerOrderId: result.order.providerOrderId,
      });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Stripe Webhook Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
