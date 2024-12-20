// pages/_app.js
import { NextUIProvider } from '@nextui-org/react';
import { UserProvider } from '@/components/UserContext'; 
import Header from '@/components/Header';
import ProtectedRoute from '../components/ProtectedRoute';
import '../utils/global.css';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const authRequiredPaths = ['/equipment', '/protected-route', '/emails', '/users', '/']; // Укажите защищенные маршруты



function MyApp({ Component, pageProps, router }) {
    const isAuthRequired = authRequiredPaths.some((path) => router.pathname.startsWith(path));
    const showHeader = router.pathname !== '/login';
    
  return (
    <NextUIProvider>
      <Head>
        <link rel="icon" href="/assets/img/favicon.ico" type="image/x-icon" />
      </Head>
      {isAuthRequired ? (
        
        <ProtectedRoute>
          <UserProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          {showHeader && <Header />}
              <Component {...pageProps} />
          </UserProvider>
        </ProtectedRoute>
      ) : (
        <UserProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        {showHeader && <Header />}
          <Component {...pageProps} />
      </UserProvider>
      )}
    </NextUIProvider>
  );
}

export default MyApp;
