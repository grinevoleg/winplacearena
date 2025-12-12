import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Детальное логирование для диагностики
  const url = request.nextUrl;
  console.log(`[Middleware] ${request.method} ${url.pathname}${url.search}`);
  console.log(`[Middleware] Headers:`, {
    host: request.headers.get('host'),
    'user-agent': request.headers.get('user-agent'),
    'x-forwarded-for': request.headers.get('x-forwarded-for'),
  });
  
  // Продолжаем обработку запроса
  const response = NextResponse.next();
  
  // Добавляем заголовки для диагностики
  response.headers.set('X-Middleware-Processed', 'true');
  
  return response;
}

export const config = {
  // Применяем middleware ко всем путям, кроме статических файлов
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

