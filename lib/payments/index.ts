import { PaymentProvider } from './types';
import { LemonSqueezyProvider } from './lemonsqueezy';
import { StripeProvider } from './stripe';
import { PayPalProvider } from './paypal';
import { RazorpayProvider } from './razorpay';
import { DemoPaymentProvider } from './demo';

export function getPaymentProvider(overrideName?: string): PaymentProvider {
  const isDemo = process.env.DEMO_MODE === 'true';
  const providerName = (overrideName || process.env.PAYMENT_PROVIDER || 'lemonsqueezy').toLowerCase();

  if (isDemo && providerName === 'demo') {
    return new DemoPaymentProvider();
  }

  switch (providerName) {
    case 'lemonsqueezy':
      return new LemonSqueezyProvider();
    case 'stripe':
      return new StripeProvider();
    case 'paypal':
      return new PayPalProvider();
    case 'razorpay':
      return new RazorpayProvider();
    case 'demo':
      return new DemoPaymentProvider();
    default:
      if (isDemo) return new DemoPaymentProvider();
      return new LemonSqueezyProvider();
  }
}

export * from './types';
