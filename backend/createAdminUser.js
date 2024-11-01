const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Подключение к базе данных
mongoose.connect('mongodb+srv://admin:nOHsNvhtCRTI82C4@psu-database.cny26np.mongodb.net/webconnect', {
})
.then(() => console.log('Подключение к базе данных установлено'))
.catch((error) => console.error('Ошибка подключения:', error));

// Определение схемы пользователя
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'viewer' },
    permissions: { type: [String], default: [] },
    lastLogin: { type: Date },
    loginHistory: [{
        time: { type: Date },
        success: { type: Boolean },
    }],
    twofaEnable: { type: Boolean },
    twofaSecret: { type: String, unique: true }
});

const User = mongoose.model('User', UserSchema);

async function createAdminUser() {
    try {
        const hashedPassword = await bcrypt.hash('Qq240202', 10);
        const user = new User({
            username: 'admin',
            email: 'nk.osinsky@icloud.com',
            password: hashedPassword,
            role: 'admin',
            twofaEnable: false,
        });

        await user.save();
        console.log('Пользователь успешно создан');
        mongoose.connection.close();
    } catch (error) {
        console.error('Ошибка при создании пользователя:', error);
    }
}

createAdminUser();
