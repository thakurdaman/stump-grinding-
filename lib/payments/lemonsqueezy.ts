import { PaymentProvider, CheckoutOptions, CheckoutResult, WebhookResult } from './types';
import crypto from 'crypto';

export class LemonSqueezyProvider implements PaymentProvider {
  name = 'lemonsqueezy';

  private getVariantId(productId: string): string {
    if (productId === 'playbook-only') return process.env.LEMONSQUEEZY_VARIANT_PLAYBOOK || '';
    if (productId === 'calculator-templates') return process.env.LEMONSQUEEZY_VARIANT_CALCULATOR || '';
    if (productId === 'full-kit') return process.env.LEMONSQUEEZY_VARIANT_FULL_KIT || '';
    return '';
  }

  async createCheckout(options: CheckoutOptions): Promise<CheckoutResult> {
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = this.getVariantId(options.product.id);

    if (!apiKey || !storeId || !variantId) {
      throw new Error(
        'Lemon Squeezy credentials missing. Set LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID, and variant env vars.'
      );
    }

    const payload = {
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: options.customerEmail,
            name: options.customerName || undefined,
            custom: {
              version_id: options.product.id,
            },
          },
          product_options: {
            redirect_url: options.successUrl,
          },
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: storeId,
            },
          },
          variant: {
            data: {
              type: 'variants',
              id: variantId,
            },
          },
        },
      },
    };

    const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Lemon Squeezy API error: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    return {
      redirectUrl: data.data.attributes.url,
      providerOrderId: data.data.id,
    };
  }

  async verifyWebhook(req: Request): Promise<WebhookResult> {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      return { valid: false, error: 'LEMONSQUEEZY_WEBHOOK_SECRET not configured' };
    }

    const signature = req.headers.get('x-signature');
    if (!signature) {
      return { valid: false, error: 'Missing x-signature header' };
    }

    const rawBody = await req.text();
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
      return { valid: false, error: 'Invalid HMAC signature' };
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;

    if (eventName === 'order_created') {
      const attributes = payload.data?.attributes;
      const customData = payload.meta?.custom_data;
      return {
        valid: true,
        eventType: eventName,
        order: {
          providerOrderId: String(payload.data?.id),
          email: attributes?.user_email,
          versionId: customData?.version_id,
          amount: (attributes?.total || 0) / 100,
          currency: (attributes?.currency || 'USD').toUpperCase(),
        },
      };
    }

    return { valid: true, eventType: eventName };
  }
}
