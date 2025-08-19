import createNextIntlPlugin from 'next-intl/plugin';
import type {NextConfig} from 'next';
 
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');
 
/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
 
export default withNextIntl(nextConfig);