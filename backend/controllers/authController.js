const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/Users.cjs');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const mongoose = require('mongoose');

async function generateQRCodeWithLogo(text, logoPath) {
    const canvas = createCanvas(300, 300); // Устанавливаем размер QR-кода
    const ctx = canvas.getContext('2d');

    // Генерация QR-кода без белой рамки
    await qrcode.toCanvas(canvas, text, {
        margin: 0, // Убираем белую рамку
        width: 300, // Размер QR-кода
        color: {
            dark: '#000000', // Цвет темных элементов
            light: '#0000' // Прозрачный фон
        },
    });

    // Загружаем логотип и размещаем его в центре QR-кода
    const logo = await loadImage(logoPath);
    const logoSize = 60; // Размер логотипа
    const logoPosition = (canvas.width - logoSize) / 2;
    ctx.drawImage(logo, logoPosition, logoPosition, logoSize, logoSize);

    return canvas.toDataURL(); // Возвращаем QR-код с логотипом как base64 изображение
}
const loginLimiter = new RateLimiterMemory({
    points: 3, 
    duration: 21600, // 6 часов
});

const authorization = async (req, res) => {
    const { login, password } = req.body;

    try {
        // Поиск пользователя по логину или email
        const user = await User.findOne({
            $or: [{ username: login }, { email: login }]
        });

        if (!user) {
            return res.status(401).json({ message: 'Неверный логин или пароль' });
        }

        await loginLimiter.delete(login);

        // Сравнение паролей
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Неверный логин или пароль' });
        }

        // Проверка наличия 2FA секрета и его создание при отсутствии
        if (!user.twofaSecret) {
            const secret = speakeasy.generateSecret({ length: 20, name: 'WebConnect' });
            user.twofaSecret = secret.base32; // сохраняем секрет в базе данных
            await user.save();

            // Генерация QR-кода с логотипом
            const qrCodeWithLogo = await generateQRCodeWithLogo(secret.otpauth_url, path.join(__dirname, '../assets/logo.png'));

            // Логирование отправки инструкции по настройке 2FA
            console.log('Отправка инструкции по настройке 2FA пользователю:', {
                twofaRequired: true,
                message: 'Настройте двухфакторную аутентификацию',
                qrcode: qrCodeWithLogo,
                manualCode: secret.base32
            });

            return res.status(200).json({
                twofaRequired: true,
                message: 'Настройте двухфакторную аутентификацию',
                qrcode: qrCodeWithLogo,
                manualCode: secret.base32,
                userId: user._id  // Передаем только userId
            });
        }

        // Проверка: Если двухфакторная аутентификация включена, возвращаем статус ожидания 2FA кода
        if (user.twofaEnable) {
            return res.status(200).json({
                twofaRequired: false,
                twofaEnable: true, // Добавляем это поле
                userId: user._id,
                message: 'Введите код 2FA для завершения входа'
            });
        }
        console.log(user.twofaEnable)
        // Если двухфакторная аутентификация не включена, но пользователь авторизован
        res.status(200).json({ message: 'Успешная авторизация без 2FA', userId: user._id });
    } catch (error) {
        if (error instanceof RateLimiterMemory.RateLimiterRes) {
            console.log('Аккаунт заблокирован на 6 часов из-за большого количества неудачных попыток');
            return res.status(429).json({ message: 'Аккаунт заблокирован на 6 часов из-за слишком большого количества неудачных попыток' });
        }
        console.error('Ошибка на сервере:', error);
        res.status(500).json({ message: 'Произошла ошибка на сервере' });
    }
};

const verifyTwoFACode = async (req, res) => {
    const { userId, token } = req.body;
    console.log(userId, token);
    // Проверка, является ли userId корректным ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Некорректный формат userId' });
    }

    try {
        const user = await User.findById(userId);

        if (!user || !user.twofaSecret) {
            return res.status(400).json({ message: 'Настройка 2FA не завершена' });
        }

        const isTokenValid = speakeasy.totp.verify({
            secret: user.twofaSecret,
            encoding: 'base32',
            token,
        });

        if (!isTokenValid) {
            return res.status(401).json({ message: 'Неверный код 2FA' });
        }

        // При успешной проверке обновляем twofaEnable на true
        user.twofaEnable = true;
        await user.save();

        // Генерация токена и отправка на клиент
        const jwtToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '15d' }
        );
        
        res.status(200).json({ 
            message: '2FA успешно подтверждено и авторизация завершена', 
            user_id: user._id.toString(),  // Преобразуем ObjectId в строку
            token: jwtToken 
        });

    } catch (error) {
        console.error('Ошибка при верификации 2FA:', error);
        res.status(500).json({ message: 'Ошибка на сервере при проверке 2FA' });
    }
};

const getUserById = async (req, res) => {
    const { userId } = req.params;  // Получаем id из параметров запроса

    try {
      const user = await User.findById(userId).select('-password');  // Не отправляем пароль
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  };

module.exports = {
    authorization,
    verifyTwoFACode,
    getUserById
};