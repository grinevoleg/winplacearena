import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Минимальное логирование для диагностики
  console.log(`[Middleware] ${request.method} ${request.nextUrl.pathname}`);
  
  // Просто пропускаем запрос дальше
  return NextResponse.next();
}

export const config = {
  // Применяем middleware только к основным путям
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next|favicon.ico).*)',
  ],
};

