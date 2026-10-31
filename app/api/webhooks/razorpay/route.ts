import { NextResponse } from 'next/server';
import { RazorpayProvider } from '@/lib/payments/razorpay';
import { createOrFulfillOrder } from '@/lib/orders';

export async function POST(req: Request) {
  try {
    const provider = new RazorpayProvider();
    const result = await provider.verifyWebhook(req);

    if (!result.valid) {
      console.warn('Invalid Razorpay webhook:', result.error);
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    if (result.order) {
      await createOrFulfillOrder({
        email: result.order.email,
        versionId: result.order.versionId,
        amount: result.order.amount,
        currency: result.order.currency,
        provider: 'razorpay',
        providerOrderId: result.order.providerOrderId,
      });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Razorpay Webhook Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
