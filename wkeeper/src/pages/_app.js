// pages/_app.js
import { NextUIProvider } from '@nextui-org/react';
import AuthLayout from '@/components/AuthLayout';
import { UserProvider } from '@/components/UserContext'; 

import ProtectedRoute from '../components/ProtectedRoute';
import '../utils/global.css';

const authRequiredPaths = ['/equipment', '/protected-route', '/emails', '/users']; // Укажите защищенные маршруты



function MyApp({ Component, pageProps, router }) {
    const isAuthRequired = authRequiredPaths.some((path) => router.pathname.startsWith(path));
    const showHeader = router.pathname !== '/login';
    const isPublicRoute = router.asPath.startsWith('/equipment/');
    
  return (
    <NextUIProvider>
      {isAuthRequired ? (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      ) : (
        <Component {...pageProps} />
      )}
    </NextUIProvider>
  );
}

export default MyApp;
