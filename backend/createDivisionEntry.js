// createDivisionEntry.js

const mongoose = require('mongoose');
require('dotenv').config();

// Подключаемся к MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Успешное подключение к MongoDB');
})
.catch((error) => {
    console.error('Ошибка подключения к MongoDB:', error);
});

// Определяем схему и модель для коллекции Division
const divisionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rusName: { type: String, required: true }
});

const Division = mongoose.model('Division', divisionSchema);

// Функция для создания новой записи
async function createDivision() {
    try {
        const newDivision = new Division({
            name: 'pavlodarskoe',
            rusName: 'ЖК Павлодарское'
        });

        await newDivision.save();
        console.log('Запись успешно создана:', newDivision);
    } catch (error) {
        console.error('Ошибка при создании записи:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Запускаем функцию создания записи
createDivision();
