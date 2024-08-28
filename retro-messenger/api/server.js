const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Endpoint для приема отчетов CSP
app.post('/csp-report', (req, res) => {
    console.log('CSP Violation:', req.body);
    res.status(204).send(); // Отправляем ответ без содержимого
});


let messages = []; // Хранилище сообщений
let clients = [];  // Хранилище клиентов для долгих опросов

// Обработчик для долгих опросов (GET запросы)
app.get('/api/server', (req, res) => {
    try {
        const clientId = Date.now();
        const newClient = { id: clientId, res };

        clients.push(newClient);

        // Таймаут для завершения запроса через 25 секунд
        setTimeout(() => {
            clients = clients.filter(client => client.id !== clientId);
            res.status(200).json({ messages: [] });
        }, 25000);

        // Удаление клиента при закрытии соединения
        req.on('close', () => {
            clients = clients.filter(client => client.id !== clientId);
        });
    } catch (error) {
        console.error('Error handling GET request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Обработчик для отправки сообщений (POST запросы)
app.post('/api/server', (req, res) => {
    try {
        const { message, userId } = req.body;
        if (message && userId) {
            const newMessage = {
                id: Date.now(),
                userId,
                message,
                timestamp: new Date().toISOString(),
            };
            messages.push(newMessage);

            // Отправка сообщения всем клиентам
            clients.forEach(client => {
                client.res.json({ message: newMessage });
            });

            // Очистка клиентов после отправки сообщения
            clients = [];

            res.status(200).json({ status: 'Message sent' });
        } else {
            res.status(400).json({ error: 'Message and userId are required' });
        }
    } catch (error) {
        console.error('Error handling POST request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
