import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // List of static pages. The `metadataBase` in layout.tsx will prefix these.
  const staticRoutes = [
    '/',
    '/achievements',
    '/contact',
    '/gallery',
    '/news',
    '/pengumuman',
    '/profile',
    '/profile/accreditation',
    '/profile/organization-structure',
    '/profile/uniform',
    '/profile/vision-mission',
    '/videos',
  ];

  const staticUrls = staticRoutes.map((route) => ({
    url: route, // Use relative paths
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1 : 0.8,
  }));

  // NOTE: For a complete sitemap, you should also dynamically generate URLs
  // for pages like news articles (e.g., /news/[id]). This requires fetching
  // all article IDs from your database.

  return [
    ...staticUrls,
  ];
}

