const WebSocket = require('ws');
const mongoose = require('mongoose');
const Equipment = require('./models/Equipment.cjs'); // Импортируем модель оборудования
const QRCode = require('qrcode'); // Импортируем библиотеку для генерации QR-кодов
const Division = require('./models/Division.cjs'); // Импортируем модель Division

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB:', err));

const wsServer = new WebSocket.Server({ port: 8181 });

wsServer.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', async (message) => {
        try {
            const computerInfo = JSON.parse(message);
            if (computerInfo.status === 'online' && computerInfo.name) {
                // Сохраняем имя машины на уровне WebSocket-соединения
                ws.machineName = computerInfo.name;

                const equipment = await Equipment.findOneAndUpdate(
                    { name: computerInfo.name },
                    { online: true },
                    { new: true }
                );

                // Обновление или добавление записи об оборудовании
                const addEquipment = async (computerInfo) => {
                    const disks = [];
                    const components = [];

                    // Обновляем статус оборудования в MongoDB

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
                        } else {
                            const existingComponent = existingComponents.find(comp => comp.Type === component.Type && comp.Name === component.Name);
                            if (!existingComponent) {
                                components.push(component);
                            } else {
                                existingComponent.Quantity = component.Quantity || existingComponent.Quantity;
                                existingComponent.Data = component.Data || existingComponent.Data;
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

                    // Генерация QR-кода
                    const qrUrl = `http://webconnect.rubikom.kz/equipment/${computerInfo.name}`;
                    const qrCodeData = await QRCode.toDataURL(qrUrl);

                    // Обновляем оборудование с QR-кодом
                    updatedEquipment = await Equipment.findOneAndUpdate(
                        filter,
                        { qrcode: qrCodeData },
                        options
                    );

                    console.log(`Updated equipment data for: ${computerInfo.name}`);
                };

                await addEquipment(computerInfo);
            }
        } catch (error) {
            console.error('Error updating equipment status:', error);
        }
    });

    ws.on('close', async () => {
        if (ws.machineName) { // Проверяем, что machineName установлен
            try {
                // Устанавливаем статус offline при отключении клиента
                await Equipment.findOneAndUpdate(
                    { name: ws.machineName },
                    { online: false },
                    { new: true }
                );
                console.log(`Updated equipment status to offline for: ${ws.machineName}`);
            } catch (error) {
                console.error('Failed to update equipment status to offline:', error);
            }
        }
    });
});

console.log('\x1b[36mWebSocket server is running on ws://localhost:8181\x1b[0m');
module.exports = wsServer;