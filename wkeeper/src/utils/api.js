// В src/utils/api.js или другом файле
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000', // Базовый URL для API
});

export const authenticateUser = async (username, password) => {
    try {
        const response = await api.post('/users/auth', { username, password });
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Произошла ошибка. Пожалуйста, попробуйте позже.',
        };
    }
};