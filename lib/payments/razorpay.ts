import { PaymentProvider, CheckoutOptions, CheckoutResult, WebhookResult } from './types';
import crypto from 'crypto';

export class RazorpayProvider implements PaymentProvider {
  name = 'razorpay';

  async createCheckout(options: CheckoutOptions): Promise<CheckoutResult> {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are required.');
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    // Amount in subunits (cents for USD, paise for INR)
    const amountInSubunits = Math.round(options.product.price * 100);

    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInSubunits,
        currency: 'USD',
        receipt: `rcpt_${Date.now()}`,
        notes: {
          version_id: options.product.id,
          email: options.customerEmail,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Razorpay order API error: ${res.status} ${err}`);
    }

    const order = await res.json();
    // Razorpay standard checkout: pass orderId back to success/checkout page for client checkout popup
    const redirectUrl = new URL(options.successUrl);
    redirectUrl.searchParams.set('razorpay_order_id', order.id);
    redirectUrl.searchParams.set('version_id', options.product.id);
    redirectUrl.searchParams.set('email', options.customerEmail);

    return {
      redirectUrl: redirectUrl.toString(),
      providerOrderId: order.id,
    };
  }

  async verifyWebhook(req: Request): Promise<WebhookResult> {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      return { valid: false, error: 'RAZORPAY_WEBHOOK_SECRET not set' };
    }

    const signature = req.headers.get('x-razorpay-signature');
    if (!signature) {
      return { valid: false, error: 'Missing x-razorpay-signature header' };
    }

    const rawBody = await req.text();
    const hmac = crypto.createHmac('sha256', secret);
    const expectedSig = hmac.update(rawBody).digest('hex');

    if (expectedSig !== signature) {
      return { valid: false, error: 'Razorpay signature mismatch' };
    }

    const payload = JSON.parse(rawBody);
    if (payload.event === 'order.paid' || payload.event === 'payment.captured') {
      const payment = payload.payload?.payment?.entity;
      const notes = payment?.notes || {};
      return {
        valid: true,
        eventType: payload.event,
        order: {
          providerOrderId: payment?.order_id || payment?.id,
          email: notes.email || payment?.email,
          versionId: notes.version_id,
          amount: (payment?.amount || 0) / 100,
          currency: (payment?.currency || 'USD').toUpperCase(),
        },
      };
    }

    return { valid: true, eventType: payload.event };
  }
}
