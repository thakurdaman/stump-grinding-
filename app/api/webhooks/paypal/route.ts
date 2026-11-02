import { NextResponse } from 'next/server';
import { PayPalProvider } from '@/lib/payments/paypal';
import { createOrFulfillOrder, markOrderRefunded } from '@/lib/orders';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const provider = new PayPalProvider();
    const result = await provider.verifyWebhook(req);

    if (!result.valid) {
      console.warn('Invalid PayPal webhook:', result.error);
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    if (result.order && (result.eventType === 'PAYMENT.CAPTURE.COMPLETED' || !result.eventType)) {
      await createOrFulfillOrder({
        email: result.order.email,
        versionId: result.order.versionId,
        amount: result.order.amount,
        currency: result.order.currency,
        provider: 'paypal',
        providerOrderId: result.order.providerOrderId,
      });
    } else if (
      result.eventType === 'PAYMENT.CAPTURE.REFUNDED' ||
      result.eventType === 'PAYMENT.CAPTURE.REVERSED'
    ) {
      try {
        const providerOrderId = (result as any).resource?.id || (result as any).order?.providerOrderId;
        if (providerOrderId) {
          const order = await db.order.findFirst({ where: { providerOrderId } });
          if (order) {
            await markOrderRefunded(order.id);
          }
        }
      } catch (refundErr) {
        console.warn('PayPal refund processing error:', refundErr);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('PayPal Webhook Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
