import { NextResponse } from 'next/server';
import { LemonSqueezyProvider } from '@/lib/payments/lemonsqueezy';
import { createOrFulfillOrder } from '@/lib/orders';

export async function POST(req: Request) {
  try {
    const provider = new LemonSqueezyProvider();
    const result = await provider.verifyWebhook(req);

    if (!result.valid) {
      console.warn('Invalid Lemon Squeezy webhook signature:', result.error);
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    if (result.order) {
      await createOrFulfillOrder({
        email: result.order.email,
        versionId: result.order.versionId,
        amount: result.order.amount,
        currency: result.order.currency,
        provider: 'lemonsqueezy',
        providerOrderId: result.order.providerOrderId,
      });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Lemon Squeezy Webhook Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
