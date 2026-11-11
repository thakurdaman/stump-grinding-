import type { Metadata } from 'next';
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { SITE_CONFIG } from '@/config/site';
import { Analytics } from '@/components/Analytics';
import { PRODUCTS } from '@/config/products';
import { FAQS } from '@/config/faqs';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['400', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.shortName}`,
  },
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/cover.jpg',
        width: 1280,
        height: 720,
        alt: 'The Stump Grinding Playbook: Beginner Edition',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: ['/images/cover.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/icon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  verification: {
    google: 'pHtFzBmjyE5xr_ijVZo-TJyzqbQ4F5W-I_VNZAkFDzI',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Schema.org structured data (Organization, Product with Offers, FAQPage rich snippets)
  const organizationSchema = {
    '@type': 'Organization',
    '@id': `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/images/cover.jpg`,
    email: SITE_CONFIG.supportEmail,
    contactPoint: {
      '@type': 'ContactPoint',
      email: SITE_CONFIG.supportEmail,
      contactType: 'customer support',
      areaServed: 'US',
      availableLanguage: 'English',
    },
  };

  const productSchema = {
    '@type': 'Product',
    '@id': `${SITE_CONFIG.url}/#product`,
    name: 'The First 10 Stumps System',
    description: SITE_CONFIG.description,
    image: `${SITE_CONFIG.url}/images/cover.jpg`,
    brand: {
      '@type': 'Brand',
      name: SITE_CONFIG.name,
    },
    // Real buyer reviews and aggregate rating schema will be populated as verified customer reviews are received
    offers: PRODUCTS.map((p) => ({
      '@type': 'Offer',
      name: p.name,
      price: p.price.toFixed(2),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${SITE_CONFIG.url}/#pricing`,
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'USD',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'US',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'US',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    })),
  };

  const faqSchema = {
    '@type': 'FAQPage',
    '@id': `${SITE_CONFIG.url}/#faq`,
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const graphSchema = {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema, productSchema, faqSchema],
  };

  return (
    <html lang="en" className={`${fraunces.variable} ${plusJakartaSans.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graphSchema) }}
        />
      </head>
      <body className="font-sans bg-[#FBF6EC] text-bark antialiased min-h-screen flex flex-col selection:bg-orange/20 selection:text-bark">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
