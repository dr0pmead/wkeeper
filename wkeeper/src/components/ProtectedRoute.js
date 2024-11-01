// components/ProtectedRoute.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Loading from './Loading';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      router.push('/login'); // Если токена нет, перенаправляем на страницу входа
    } else {
      setIsLoading(false); // Если токен есть, отключаем загрузку
    }
  }, [router]);

  if (isLoading) {
    return <Loading />; // Показываем компонент загрузки, пока идет проверка
  }

  return children;
};

export default ProtectedRoute;
