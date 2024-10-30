// pages/_app.js
import { NextUIProvider } from '@nextui-org/react';
import ProtectedRoute from '../components/ProtectedRoute';
import '../utils/global.css';

const authRequiredPaths = ['/equipment', '/protected-route', '/emails', '/users']; // Укажите защищенные маршруты

function MyApp({ Component, pageProps, router }) {
  const isAuthRequired = authRequiredPaths.some((path) => router.pathname.startsWith(path));

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
