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

    return [...staticUrls];
}
