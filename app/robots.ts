import type { MetadataRoute } from 'next';

const SITE = 'https://skinodetis.gr';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin', // η περιοχή διαχείρισης δεν χρειάζεται indexing
    },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
