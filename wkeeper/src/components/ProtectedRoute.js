// components/ProtectedRoute.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Loading from './Loading';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('auth_token');

    if (!token) {
      router.push('/login'); // Перенаправление на страницу входа, если токена нет
    } else {
      setIsLoading(false); // Отключаем загрузку, если токен есть
    }
  }, [router]);

  if (isLoading) {
    return <Loading />; // Показываем компонент загрузки для всего приложения
  }

  return children;
};

export default ProtectedRoute;
