import { PaymentProvider, CheckoutOptions, CheckoutResult, WebhookResult } from './types';

export class PayPalProvider implements PaymentProvider {
  name = 'paypal';

  private getBaseUrl(): string {
    return process.env.PAYPAL_MODE === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';
  }

  private async getAccessToken(): Promise<string> {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('PayPal Client ID or Secret missing in environment variables.');
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const res = await fetch(`${this.getBaseUrl()}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!res.ok) {
      throw new Error(`PayPal auth failed: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    return data.access_token;
  }

  async createCheckout(options: CheckoutOptions): Promise<CheckoutResult> {
    const token = await this.getAccessToken();

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: options.product.id,
          description: options.product.name,
          custom_id: JSON.stringify({
            version_id: options.product.id,
            email: options.customerEmail,
          }),
          amount: {
            currency_code: 'USD',
            value: options.product.price.toFixed(2),
          },
        },
      ],
      application_context: {
        brand_name: 'The Stump Grinding Playbook',
        return_url: options.successUrl,
        cancel_url: options.cancelUrl,
        user_action: 'PAY_NOW',
      },
    };

    const res = await fetch(`${this.getBaseUrl()}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    });

    if (!res.ok) {
      throw new Error(`PayPal order creation failed: ${res.status} ${await res.text()}`);
    }

    const order = await res.json();
    const approveLink = order.links?.find((l: any) => l.rel === 'approve')?.href;

    if (!approveLink) {
      throw new Error('No PayPal approve link returned.');
    }

    return {
      redirectUrl: approveLink,
      providerOrderId: order.id,
    };
  }

  async captureOrder(orderId: string): Promise<any> {
    const token = await this.getAccessToken();
    const res = await fetch(`${this.getBaseUrl()}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      const errorText = await res.text();
      // If already captured, fetch order details instead
      if (res.status === 422 && errorText.includes('ORDER_ALREADY_CAPTURED')) {
        return this.getOrder(orderId);
      }
      throw new Error(`PayPal order capture failed: ${res.status} ${errorText}`);
    }

    return await res.json();
  }

  async getOrder(orderId: string): Promise<any> {
    const token = await this.getAccessToken();
    const res = await fetch(`${this.getBaseUrl()}/v2/checkout/orders/${orderId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`PayPal get order failed: ${res.status} ${await res.text()}`);
    }
    return await res.json();
  }

  async verifyWebhook(req: Request): Promise<WebhookResult> {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    if (!webhookId) {
      return { valid: false, error: 'PAYPAL_WEBHOOK_ID is not configured' };
    }

    const rawBody = await req.text();
    const token = await this.getAccessToken();

    // Verify webhook signature with PayPal verify API
    const verifyPayload = {
      transmission_id: req.headers.get('paypal-transmission-id'),
      transmission_time: req.headers.get('paypal-transmission-time'),
      cert_url: req.headers.get('paypal-cert-url'),
      auth_algo: req.headers.get('paypal-auth-algo'),
      transmission_sig: req.headers.get('paypal-transmission-sig'),
      webhook_id: webhookId,
      webhook_event: JSON.parse(rawBody),
    };

    const res = await fetch(`${this.getBaseUrl()}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verifyPayload),
    });

    if (!res.ok) {
      return { valid: false, error: 'PayPal webhook verification call failed' };
    }

    const verifyData = await res.json();
    if (verifyData.verification_status !== 'SUCCESS') {
      return { valid: false, error: 'PayPal webhook signature status not SUCCESS' };
    }

    const event = JSON.parse(rawBody);
    const resource = event.resource;

    if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      let custom: any = {};
      try {
        if (resource?.custom_id) custom = JSON.parse(resource.custom_id);
      } catch {
        // Fall back to empty object if custom_id is not JSON
      }
      return {
        valid: true,
        eventType: event.event_type,
        resource,
        order: {
          providerOrderId: resource?.id,
          email: custom.email || resource?.payer?.email_address,
          versionId: custom.version_id,
          amount: parseFloat(resource?.amount?.value || '0'),
          currency: (resource?.amount?.currency_code || 'USD').toUpperCase(),
        },
      };
    }

    return { valid: true, eventType: event.event_type, resource };
  }
}
