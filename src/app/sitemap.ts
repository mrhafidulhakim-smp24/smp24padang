import { MetadataRoute } from 'next';

const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://smpn24padang.sch.id';

export default function sitemap(): MetadataRoute.Sitemap {
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
        url: `${siteUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority:
            route === '/'
                ? 1
                : route === '/news' ||
                  route === '/pengumuman' ||
                  route === '/gallery' ||
                  route === '/videos'
                ? 0.9
                : 0.8,
    }));

    return [...staticUrls];
}
