import withNextIntl from 'next-intl/plugin';
 
const withIntl = withNextIntl('./src/i18n.ts');
 
export default withIntl({
  // Other Next.js configuration ...
});
