const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

let messages = []; // Хранилище сообщений

// Обработчик WebSocket соединений
wss.on('connection', (ws) => {
    console.log('Client connected');

    // Отправить все предыдущие сообщения новому клиенту
    ws.send(JSON.stringify({ type: 'initial', messages }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        // Обработка отправки текстового сообщения
        if (data.type === 'message') {
            const newMessage = {
                id: Date.now(),
                userId: data.userId,
                message: data.message,
                timestamp: new Date().toISOString(),
            };
            messages.push(newMessage);

            // Рассылаем новое сообщение всем клиентам
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'message', message: newMessage }));
                }
            });
        }

        // Обработка отправки изображения
        if (data.type === 'image') {
            const newImage = {
                id: Date.now(),
                userId: data.userId,
                image: data.image, // Base64 изображение
                timestamp: new Date().toISOString(),
            };

            // Рассылаем изображение всем клиентам
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'image', image: newImage }));
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
