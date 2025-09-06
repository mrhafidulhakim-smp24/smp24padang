import { MetadataRoute } from 'next';

// This will use the NEXT_PUBLIC_SITE_URL environment variable.
// Make sure to set it in your Vercel project settings.
// Fallback is for the current Vercel deployment URL.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smpn24padang.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
