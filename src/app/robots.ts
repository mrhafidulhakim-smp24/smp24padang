import { MetadataRoute } from 'next';

const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://smpn24padang.sch.id';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/api', '/login'],
        },
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
