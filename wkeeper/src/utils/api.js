import axios from 'axios';
import { setCookie } from 'nookies'; // Подключаем nookies для работы с куками
import { useRouter } from 'next/router';

export const api = axios.create({
    baseURL: 'http://localhost:5000', // Базовый URL для API
});

export const authenticateUser = async (login, password) => {
    try {
        const response = await api.post('/users/auth', { login, password });
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Произошла ошибка. Пожалуйста, попробуйте позже.',
        };
    }
};

export const verifyTwoFA = async (userId, code) => {
    try {
        // Отправляем userId и токен 2FA на сервер
        const response = await api.post('/users/verify-2fa', { userId, token: code });

        if (response.data.message === '2FA успешно подтверждено и авторизация завершена') {
            // Сохраняем токен и user_id, полученные с сервера, в куках на 15 дней
            setCookie(null, 'token', response.data.token, { maxAge: 15 * 24 * 60 * 60, path: '/' });
            setCookie(null, 'userId', response.data.user_id, { maxAge: 15 * 24 * 60 * 60, path: '/' });
            
            return { success: true, message: response.data.message };
        } else {
            return { success: false, message: response.data.message || 'Ошибка при проверке 2FA' };
        }
    } catch (error) {
        return { success: false, message: 'Ошибка верификации 2FA' };
    }
};

export const fetchAllDivisions = async () => {
    try {
        const response = await api.get('/division/getAll');
        return response.data; // Возвращаем массив записей из коллекции division
    } catch (error) {
        console.error('Ошибка при получении данных из division:', error);
        throw error; // Пробрасываем ошибку для обработки в компоненте
    }
};

export const fetchEquipment = async (division, activeStatus) => {
    try {
        console.log('Параметры:', { division, activeStatus });
        const response = await api.get(`/equipment/${encodeURIComponent(division)}/${activeStatus}`);
        return response.data; // Возвращаем массив оборудования
    } catch (error) {
        console.error('Ошибка при получении данных оборудования:', error);
        throw error; // Пробрасываем ошибку для обработки в компоненте
    }
};