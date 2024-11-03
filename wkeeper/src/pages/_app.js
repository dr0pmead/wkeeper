// pages/_app.js
import { NextUIProvider } from '@nextui-org/react';
import { UserProvider } from '@/components/UserContext'; 
import Header from '@/components/Header';
import ProtectedRoute from '../components/ProtectedRoute';
import '../utils/global.css';

const authRequiredPaths = ['/equipment', '/protected-route', '/emails', '/users', '/']; // Укажите защищенные маршруты



function MyApp({ Component, pageProps, router }) {
    const isAuthRequired = authRequiredPaths.some((path) => router.pathname.startsWith(path));
    const showHeader = router.pathname !== '/login';
    
  return (
    <NextUIProvider>
      {isAuthRequired ? (
        
        <ProtectedRoute>
          <UserProvider>
          {showHeader && <Header />}
              <Component {...pageProps} />
          </UserProvider>
        </ProtectedRoute>
      ) : (
        <UserProvider>
        {showHeader && <Header />}
          <Component {...pageProps} />
      </UserProvider>
      )}
    </NextUIProvider>
  );
}

export default MyApp;
