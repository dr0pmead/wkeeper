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

    // Проверка на отсутствие токена и нахождение на странице, отличной от '/login'
    if (!token && router.pathname !== '/login') {
      router.replace('/login'); // Используем replace вместо push для предотвращения истории
    } else {
      setIsLoading(false); // Завершаем состояние загрузки только если токен есть или мы на странице логина
    }
  }, [router]);

  if (isLoading) {
    return <Loading />; // Показываем индикатор загрузки пока идет проверка
  }

  return children;
};

export default ProtectedRoute;
