import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const nextLocaleCookie = request.cookies.get('NEXT_LOCALE')?.value;
  const { pathname } = request.nextUrl;

  const localeMatch = pathname.match(/^\/(de|en)(\/|$)/);
  const currentPathLocale = localeMatch ? localeMatch[1] : null;

  // Check if it's an admin or consultant path (including locale prefixes)
  const isDashboardRoute = pathname.match(/^\/(en|de)?\/?(admin|consultant)/);

  // Protect Admin and Consultant routes
  if (!token && isDashboardRoute) {
    const locale = currentPathLocale || nextLocaleCookie || 'de';
    const url = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(url);
  }

  // Apply next-intl middleware to dashboard and auth routes
  const isIntlRoute = pathname.match(/^\/(en|de)?\/?(admin|consultant|login|verify|reset|new-password)/);

  if (isIntlRoute) {
    // If no NEXT_LOCALE cookie exists AND the URL doesn't have an explicit locale prefix (/de or /en)
    if (!nextLocaleCookie && !currentPathLocale) {
      const newUrl = new URL(`/de${pathname}`, request.url);
      const response = NextResponse.redirect(newUrl);
      response.cookies.set('NEXT_LOCALE', 'de', { path: '/', maxAge: 31536000, sameSite: 'lax' });
      return response;
    }

    // If URL has an explicit locale prefix (e.g. /en/admin/overview), update NEXT_LOCALE cookie if it differs
    if (currentPathLocale && currentPathLocale !== nextLocaleCookie) {
      const response = intlMiddleware(request);
      response.cookies.set('NEXT_LOCALE', currentPathLocale, { path: '/', maxAge: 31536000, sameSite: 'lax' });
      return response;
    }

    return intlMiddleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
