const QRCode = require('qrcode');
const Equipment = require('../models/Equipment.cjs');
const Division = require('../models/Division.cjs');

const addEquipment = async (req, res) => {
    try {
        const computerInfo = req.body;
        const disks = [];
        const components = [];

        // Проверка на наличие записи с таким именем оборудования
        const existingEquipment = await Equipment.findOne({ name: computerInfo.name });

        // Если оборудование найдено, получаем существующие диски и компоненты
        let existingDisks = existingEquipment ? existingEquipment.disks : [];
        let existingComponents = existingEquipment ? existingEquipment.components : [];
        
        // Обработка компонентов
        computerInfo.components.forEach(component => {
            if (component.Type === 'Disk') {
                const existingDisk = existingDisks.find(disk => disk.Name === component.Name);
                if (!existingDisk) {
                    disks.push({
                        Name: component.Name,
                        Size: component.Size,
                        FreeSpace: component.FreeSpace
                    });
                } else {
                    existingDisk.Size = component.Size;
                    existingDisk.FreeSpace = component.FreeSpace;
                }
            } else if (component.Type === 'Memory') {
                const existingMemory = existingComponents.find(mem => mem.Type === 'Memory' && mem.Manufacturer === component.Manufacturer);
                if (!existingMemory) {
                    components.push({
                        Type: 'Memory',
                        Manufacturer: component.Manufacturer,
                        Quantity: component.Quantity,
                        Data: component.Data
                    });
                } else {
                    existingMemory.Quantity = component.Quantity;
                    existingMemory.Data = component.Data;
                }
            } else {
                const existingComponent = existingComponents.find(comp => comp.Type === component.Type && comp.Name === component.Name);
                if (!existingComponent) {
                    components.push(component);
                } else {
                    existingComponent.Name = component.Name;
                }
            }
        });

        // Обновление компонентов и дисков
        const updatedComponents = [...existingComponents, ...components];
        const updatedDisks = [...existingDisks, ...disks];

        // Поиск соответствующего объекта Division
        const matchingDivision = await Division.findOne({ rusName: computerInfo.division });
        const divisionObject = matchingDivision ? matchingDivision : null;

        // Создание объекта данных оборудования
        const equipmentData = {
            name: computerInfo.name,
            anyDesk: computerInfo.anyDesk || existingEquipment?.anyDesk,
            teamViewer: computerInfo.teamViewer || existingEquipment?.teamViewer,
            osVersion: existingEquipment?.osVersion || computerInfo.osVersion,
            owner: existingEquipment?.owner || computerInfo.owner,
            department: existingEquipment?.department || computerInfo.department,
            division: divisionObject, // Сохраняем объект division, если он найден
            components: updatedComponents,
            disks: updatedDisks,
            ipAddress: {
                main: computerInfo.ipAddress.main || existingEquipment?.ipAddress?.main,
                secondary: computerInfo.ipAddress.secondary || existingEquipment?.ipAddress?.secondary
            },
            printer: existingEquipment?.printer || computerInfo.printer,
            lastUpdated: Date.now(),
            inventoryNumber: existingEquipment?.inventoryNumber || computerInfo.inventoryNumber,
            type: existingEquipment?.type || computerInfo.type,
        };

        // Условия для поиска и обновления
        const filter = { name: computerInfo.name };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        // Обновляем или создаем запись оборудования
        let updatedEquipment = await Equipment.findOneAndUpdate(filter, equipmentData, options);

        // Оценка производительности
        const estimation = calculateEstimation(updatedEquipment);

        // Генерация QR-кода
        const qrUrl = `http://webconnect.rubikom.kz/equipment/${computerInfo.name}`;
        const qrCodeData = await QRCode.toDataURL(qrUrl);

        // Обновляем оборудование с оценкой и QR-кодом
        updatedEquipment = await Equipment.findOneAndUpdate(
            filter,
            { estimation, qrcode: qrCodeData },
            options
        );

        res.status(200).json({
            message: 'Данные получены и успешно сохранены',
            data: updatedEquipment
        });
    } catch (error) {
        console.error('Ошибка при обработке запроса /api/createEquipment:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера', error: error.message });
    }
};

const calculateEstimation = (equipment) => {
    let totalScore = 0;
    let componentCount = 0;

    // Оценка процессора
    const cpu = equipment.components.find(comp => comp.Type === 'Processor');
    if (cpu) {
        let cpuScore = 0;
        if (cpu.Name.includes('i5') && parseInt(cpu.Name.match(/\d+/)) > 10) {
            cpuScore = 7;
        } else if (cpu.Name.includes('i7') && parseInt(cpu.Name.match(/\d+/)) > 10) {
            cpuScore = 9;
        } else if (cpu.Name.includes('Ryzen 5') && parseInt(cpu.Name.match(/\d+/)) >= 5600) {
            cpuScore = 7;
        } else if (cpu.Name.includes('Ryzen 7') && parseInt(cpu.Name.match(/\d+/)) >= 7000) {
            cpuScore = 9;
        } else {
            cpuScore = 5; // Значение по умолчанию для более старых моделей
        }
        totalScore += cpuScore;
        componentCount++;
    }

    // Оценка оперативной памяти
    const memory = equipment.components.filter(comp => comp.Type === 'Memory');
    const totalMemory = memory.reduce((acc, mem) => acc + mem.Quantity, 0);
    if (totalMemory >= 16 && memory.every(mem => mem.Data === 'DDR5')) {
        totalScore += 10; // Максимальная оценка для новой памяти
    } else if (totalMemory >= 8 && memory.every(mem => mem.Data === 'DDR4')) {
        totalScore += 7; // Средняя оценка для DDR4
    } else {
        totalScore += 5; // Для старой памяти
    }
    componentCount++;

    // Оценка накопителей
    const ssd = equipment.disks.filter(disk => disk.Name.includes('SSD'));
    const ssdCount = ssd.length;
    const sufficientSize = ssd.filter(disk => disk.Size >= 256).length;
    if (ssdCount > 0 && sufficientSize > 0) {
        totalScore += 7; // Достаточное количество и объем SSD
    } else {
        totalScore += 5; // Наличие старых или малых накопителей
    }
    componentCount++;

    // Оценка ОС
    if (equipment.osVersion.includes('Windows 10') || equipment.osVersion.includes('Windows 11')) {
        totalScore += 9; // Новые ОС
    } else {
        totalScore += 5; // Старые ОС
    }
    componentCount++;

    // Средний балл
    const averageScore = totalScore / componentCount;
    return parseFloat(averageScore.toFixed(1)); // Возвращаем с округлением до десятых
};

async function getEquipment(req, res) {
    const { id } = req.params;
    try {
        // Получаем оборудование по его ID
        const equipmentData = await Equipment.findById(id);
        if (!equipmentData) {
            return res.status(404).json({ message: 'Оборудование не найдено' });
        }

        // Находим подразделение, связанное с этим оборудованием
        const divisionData = await Division.findById(equipmentData.division);
        if (!divisionData) {
            return res.status(404).json({ message: 'Подразделение не найдено' });
        }

        // Возвращаем данные оборудования вместе с данными подразделения
        res.json({
            equipment: equipmentData,
            division: divisionData,
        });
    } catch (error) {
        console.error('Ошибка при поиске оборудования:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}

const getEquipments = async (req, res) => {
    const { division, activeStatus } = req.params;

    try {
        // Преобразуем activeStatus в булево значение
        const isActiveStatus = activeStatus === 'true';

        const equipment = await Equipment.find({
            division: division,
            online: isActiveStatus
        });

        res.status(200).json(equipment);
    } catch (error) {
        console.error('Ошибка при получении данных оборудования:', error);
        res.status(500).json({ message: 'Ошибка на сервере при получении данных оборудования' });
    }
};

const editEquipment = async (req, res) => {
    const { _id, inventoryNumber, written } = req.body;

    try {
        console.log(`Полученные данные: _id=${_id}, inventoryNumber=${inventoryNumber}, written=${written}`);

        // Находим запись по _id
        const equipment = await Equipment.findById(_id);

        if (!equipment) {
            console.log('Оборудование не найдено');
            return res.status(404).json({ message: 'Оборудование не найдено' });
        }

        // Проверим старое значение перед обновлением
        console.log(`Старое значение written: ${equipment.written}`);

        // Обновляем поля
        equipment.inventoryNumber = inventoryNumber;
        equipment.written = written;

        // Сохраняем изменения
        const updatedEquipment = await equipment.save();

        // Логируем обновленное значение
        console.log(`Новое значение written: ${updatedEquipment.written}`);

        res.status(200).json({
            message: 'Оборудование успешно обновлено',
            data: updatedEquipment
        });
    } catch (error) {
        console.error('Ошибка при обновлении оборудования:', error);
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};


module.exports = {
    addEquipment,
    getEquipments,
    editEquipment,
    getEquipment
};
