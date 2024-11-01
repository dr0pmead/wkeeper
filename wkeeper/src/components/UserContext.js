import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router'; 
import Cookies from 'js-cookie';
import { api }  from '@/utils/api'; // Используем общий экземпляр axios

// Создаем контекст для данных пользователя
const UserContext = createContext(null);

// Хук для получения данных пользователя
export const useUser = () => useContext(UserContext);

// Провайдер контекста
export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter(); 

    useEffect(() => {
        const userId = Cookies.get('userId');
        if (userId) {
            api.get(`/users/${userId}`)
                .then(response => {
                    setUserData(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Ошибка при загрузке данных пользователя:', error);
                    setLoading(false); 
                });
        } else {
            setLoading(false); 
        }
    }, []);

    return (
        <UserContext.Provider value={userData}>
            {children}
        </UserContext.Provider>
    );
};
