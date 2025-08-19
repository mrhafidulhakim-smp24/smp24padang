const withNextIntl = require('next-intl/plugin');
 
const withIntl = withNextIntl('./src/i18n.ts');
 
module.exports = withIntl({
  // Other Next.js configuration ...
});
