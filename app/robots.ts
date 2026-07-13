import type { MetadataRoute } from 'next';

const SITE = 'https://skinodetis.gr';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/search'], // διαχείριση & σελίδες αποτελεσμάτων εκτός index
    },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
