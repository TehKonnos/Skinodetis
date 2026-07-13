import type { MetadataRoute } from 'next';
import { readPlays } from './lib/plays-store';

const SITE = 'https://skinodetis.gr';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const plays = await readPlays();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    {
      url: `${SITE}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  const playPages: MetadataRoute.Sitemap = plays.map((p) => ({
    url: `${SITE}/plays/${p.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticPages, ...playPages];
}
