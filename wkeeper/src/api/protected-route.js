// pages/api/protected-route.js
export default function handler(req, res) {
    const token = req.cookies.auth_token; // Проверка токена из куки
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    // Логика для авторизованных пользователей
    res.status(200).json({ message: 'Protected content' });
  }
  