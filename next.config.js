const withNextIntl = require('next-intl/plugin');
 
const withIntl = withNextIntl('./src/i18n.ts');
 
module.exports = withIntl({
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  // Other Next.js configuration ...
});
