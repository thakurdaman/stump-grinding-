import { PaymentProvider, CheckoutOptions, CheckoutResult, WebhookResult } from './types';
import crypto from 'crypto';

export class DemoPaymentProvider implements PaymentProvider {
  name = 'demo';

  async createCheckout(options: CheckoutOptions): Promise<CheckoutResult> {
    const demoId = 'demo_' + crypto.randomBytes(8).toString('hex');
    const url = new URL(options.successUrl);
    url.searchParams.set('session_id', demoId);
    url.searchParams.set('version_id', options.product.id);
    url.searchParams.set('email', options.customerEmail);

    return {
      redirectUrl: url.toString(),
      providerOrderId: demoId,
    };
  }

  async verifyWebhook(req: Request): Promise<WebhookResult> {
    const body = await req.json();
    return {
      valid: true,
      eventType: 'demo.order.created',
      order: {
        providerOrderId: body.providerOrderId || 'demo_' + Date.now(),
        email: body.email,
        versionId: body.versionId,
        amount: body.amount || 0,
        currency: 'USD',
      },
    };
  }
}
