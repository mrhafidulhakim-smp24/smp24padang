import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.smpn24padang.sch.id';

    // List of static pages
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
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '/' ? 1 : 0.8,
    }));

    return [...staticUrls];
}
