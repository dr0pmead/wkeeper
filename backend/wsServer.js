const WebSocket = require('ws');
const mongoose = require('mongoose');
const Equipment = require('./models/Equipment.cjs'); // Импортируем модель оборудования

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
            const data = JSON.parse(message);
            console.log('Received message from client:', data);

            if (data.status === 'online' && data.machineName) {
                // Сохраняем machineName на уровне WebSocket-соединения
                ws.machineName = data.machineName;

                // Обновляем статус оборудования в MongoDB
                const equipment = await Equipment.findOneAndUpdate(
                    { name: data.machineName },
                    { online: true },
                    { new: true }
                );

                console.log(`Updated equipment status to online for: ${data.machineName}`);
            }
        } catch (error) {
            console.error('Error updating equipment status:', error);
        }
    });

    ws.on('close', async () => {
        if (ws.machineName) { // Проверяем, что machineName установлен
            try {
                // Устанавливаем статус offline при отключении клиента
                const equipment = await Equipment.findOneAndUpdate(
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
