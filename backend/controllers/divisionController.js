const Division = require('../models/Division.cjs');
const Equipment = require('../models/Equipment.cjs');

const getAllDivisions = async (req, res) => {
    try {
        // Получаем все подразделения
        const divisions = await Division.find();

        // Используем Promise.all для параллельного выполнения подсчетов
        const divisionsWithCount = await Promise.all(divisions.map(async (division) => {
            const equipmentCount = await Equipment.countDocuments({ division: division });
            return {
                ...division._doc, // Копируем все поля подразделения
                count: equipmentCount // Добавляем поле count с количеством оборудования
            };
        }));

        // Отправляем результат на клиент
        res.status(200).json(divisionsWithCount);

    } catch (error) {
        console.error('Ошибка при получении записей division:', error);
        res.status(500).json({ message: 'Ошибка на сервере при получении записей' });
    }
};

module.exports = {
    getAllDivisions
};
