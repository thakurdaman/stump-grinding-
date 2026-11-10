import { NextResponse } from 'next/server';
import { PayPalProvider } from '@/lib/payments/paypal';
import { createOrFulfillOrder, markOrderRefunded } from '@/lib/orders';
import { db } from '@/lib/db';

const MAX_BODY_BYTES = 1 * 1024 * 1024; // 1 MB — legitimate PayPal events are <10 KB

export async function POST(req: Request) {
  // Reject oversized bodies before reading to prevent memory DoS
  const contentLength = parseInt(req.headers.get('content-length') || '0', 10);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
  }

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
        const resource = result.resource;
        const upLink = resource?.links?.find((l: any) => l.rel === 'up')?.href;
        const captureIdFromLink = upLink ? upLink.split('/').pop() : null;
        const candidateIds = [
          resource?.id,
          resource?.parent_payment,
          captureIdFromLink,
          result.order?.providerOrderId,
        ].filter(Boolean) as string[];

        if (candidateIds.length > 0) {
          const order = await db.order.findFirst({
            where: {
              providerOrderId: { in: candidateIds },
            },
          });
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
