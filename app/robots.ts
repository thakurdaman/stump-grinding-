import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/download/', '/checkout/success'],
    },
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
