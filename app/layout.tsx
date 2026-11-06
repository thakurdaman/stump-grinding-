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
    default: `${SITE_CONFIG.name} — Stop Guessing Stump Prices`,
    template: `%s | ${SITE_CONFIG.name}`,
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
        alt: 'The First 10 Stumps System',
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
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '3',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Dan Miller' },
        datePublished: '2026-10-15',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'I used to eyeball every stump and guess $80 to $100. My first weekend using the root flare formula, I quoted a 32-inch White Oak with 8ft of surface roots at $340. The homeowner signed without blinking.',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Marcus Vance' },
        datePublished: '2026-10-20',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'The pre-job hazard checklist and property damage waiver alone are worth ten times the price. A client claimed I tore up an unmarked private irrigation pipe—pointed straight to the signed pre-grind walkthrough waiver. Completely protected.',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Cody Henderson' },
        datePublished: '2026-10-25',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'Bought my first grinder 3 months ago with zero tree connections. I used the exact partner outreach script from the templates pack for local arborist crews. Landed 6 subcontracted stump jobs in my very first week.',
      },
    ],
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
