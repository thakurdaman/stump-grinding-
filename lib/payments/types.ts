import { ProductTier } from '@/config/products';

export interface CheckoutOptions {
  product: ProductTier;
  customerEmail: string;
  customerName?: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutResult {
  redirectUrl: string;
  providerOrderId?: string;
}

export interface WebhookResult {
  valid: boolean;
  eventType?: string;
  order?: {
    providerOrderId: string;
    email: string;
    versionId: string;
    amount: number;
    currency: string;
  };
  error?: string;
}

export interface PaymentProvider {
  name: string;
  createCheckout(options: CheckoutOptions): Promise<CheckoutResult>;
  verifyWebhook(req: Request): Promise<WebhookResult>;
}
