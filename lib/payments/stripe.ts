import { PaymentProvider, CheckoutOptions, CheckoutResult, WebhookResult } from './types';
import crypto from 'crypto';

export class StripeProvider implements PaymentProvider {
  name = 'stripe';

  async createCheckout(options: CheckoutOptions): Promise<CheckoutResult> {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is missing.');
    }

    const params = new URLSearchParams();
    params.append('mode', 'payment');
    params.append('customer_email', options.customerEmail);
    params.append('success_url', options.successUrl + '?session_id={CHECKOUT_SESSION_ID}');
    params.append('cancel_url', options.cancelUrl);
    params.append('metadata[version_id]', options.product.id);
    params.append('payment_method_types[0]', 'card');

    params.append('line_items[0][price_data][currency]', 'usd');
    params.append('line_items[0][price_data][unit_amount]', String(Math.round(options.product.price * 100)));
    params.append('line_items[0][price_data][product_data][name]', options.product.name);
    params.append('line_items[0][price_data][product_data][description]', options.product.description);
    params.append('line_items[0][quantity]', '1');

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Stripe Checkout Session error: ${res.status} ${err}`);
    }

    const data = await res.json();
    return {
      redirectUrl: data.url,
      providerOrderId: data.id,
    };
  }

  async verifyWebhook(req: Request): Promise<WebhookResult> {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      return { valid: false, error: 'STRIPE_WEBHOOK_SECRET is not set' };
    }

    const sigHeader = req.headers.get('stripe-signature');
    if (!sigHeader) {
      return { valid: false, error: 'Missing stripe-signature header' };
    }

    const rawBody = await req.text();
    const parts = sigHeader.split(',').reduce((acc: Record<string, string>, item) => {
      const [k, v] = item.split('=');
      acc[k] = v;
      return acc;
    }, {});

    const timestamp = parts['t'];
    const signature = parts['v1'];

    if (!timestamp || !signature) {
      return { valid: false, error: 'Invalid stripe-signature format' };
    }

    const payloadToSign = `${timestamp}.${rawBody}`;
    const hmac = crypto.createHmac('sha256', secret);
    const expectedSig = hmac.update(payloadToSign).digest('hex');

    if (expectedSig !== signature) {
      return { valid: false, error: 'Stripe signature mismatch' };
    }

    const event = JSON.parse(rawBody);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      return {
        valid: true,
        eventType: event.type,
        order: {
          providerOrderId: session.id,
          email: session.customer_details?.email || session.customer_email,
          versionId: session.metadata?.version_id,
          amount: (session.amount_total || 0) / 100,
          currency: (session.currency || 'USD').toUpperCase(),
        },
      };
    }

    return { valid: true, eventType: event.type };
  }
}
