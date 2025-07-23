import { MetadataRoute } from 'next';
import { SEO_DEFAULTS } from '@damon-stack/shared';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SEO_DEFAULTS.siteUrl;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/private/',
        '/_next/',
        '/auth/error',
        '/auth/verify',
        '/*.json$',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
} 