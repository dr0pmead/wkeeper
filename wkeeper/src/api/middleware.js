// middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('auth_token'); // Получаем токен из куки

  // Если токен отсутствует, перенаправляем на страницу входа
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next(); // Продолжаем, если токен есть
}

export const config = {
  matcher: ['/equipment/:path*', '/profile/:path*', '/emails/:path*', '/users/:path*'], // защищенные маршруты
};
