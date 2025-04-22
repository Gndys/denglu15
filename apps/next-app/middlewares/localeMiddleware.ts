import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from '../app/i18n-config'; // Adjusted import path
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  // Try to get locale from cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && i18n.locales.includes(cookieLocale as any)) {
    languages = [cookieLocale, ...languages];
  }

  return matchLocale(languages, i18n.locales as unknown as string[], i18n.defaultLocale);
}

export function localeMiddleware(request: NextRequest): NextResponse | undefined {
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search; // Get search params

  // --- Skip API routes in locale middleware ---
  if (pathname.startsWith('/api/')) {
    return undefined; // API routes don't need locale redirects
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale (for pages)
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // e.g. incoming request is /products?token=123
    // The new URL is now /en/products?token=123
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}${search}`,
        request.url
      )
    );
  }

  // If locale exists, continue to the next middleware
  return undefined; 
} 