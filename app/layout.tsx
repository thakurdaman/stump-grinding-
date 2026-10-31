import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { SITE_CONFIG } from '@/config/site';
import { Analytics } from '@/components/Analytics';
import { PRODUCTS } from '@/config/products';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} — Stop Guessing What to Charge for a Stump`,
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
        alt: 'The Stump Grinding Playbook Cover',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Schema.org structured data (Product with Offers for each tier, no fake reviews)
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'The Stump Grinding Playbook & Pricing Engine',
    description: SITE_CONFIG.description,
    image: `${SITE_CONFIG.url}/images/cover.jpg`,
    brand: {
      '@type': 'Brand',
      name: SITE_CONFIG.name,
    },
    offers: PRODUCTS.map((p) => ({
      '@type': 'Offer',
      name: p.name,
      price: p.price.toFixed(2),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${SITE_CONFIG.url}/#pricing`,
    })),
  };

  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      </head>
      <body className="font-sans bg-[#FBF6EC] text-bark antialiased min-h-screen flex flex-col selection:bg-orange/20 selection:text-bark">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
