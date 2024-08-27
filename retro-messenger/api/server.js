// api/server.js
let messages = []; // Хранилище сообщений
let clients = [];  // Хранилище клиентов для долгих опросов

export default (req, res) => {
    if (req.method === 'GET') {
        // Регистрация клиента для долгого опроса
        const clientId = Date.now();  // Уникальный ID клиента
        const newClient = {
            id: clientId,
            res,
        };

        clients.push(newClient);

        req.on('close', () => {
            clients = clients.filter(client => client.id !== clientId);
        });
    } else if (req.method === 'POST') {
        // Прием нового сообщения
        const { message, userId } = req.body;
        if (message) {
            const newMessage = {
                id: Date.now(),
                userId,
                message,
                timestamp: new Date().toISOString(),
            };
            messages.push(newMessage);

            // Отправка нового сообщения всем клиентам
            clients.forEach(client => {
                client.res.json(newMessage);
            });

            // Очищаем список клиентов, так как они получили новое сообщение
            clients = [];

            res.status(200).json({ status: 'Message sent' });
        } else {
            res.status(400).json({ error: 'Message and userId are required' });
        }
    }
};
