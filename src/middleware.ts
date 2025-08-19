import createMiddleware from 'next-intl/middleware';
import {locales, localePrefix} from './navigation';
 
export default createMiddleware({
  defaultLocale: 'id',
  locales,
  localePrefix
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(id|en)/:path*']
};