// server.js
const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

let clients = [];

server.on('connection', (ws) => {
    clients.push(ws);

    ws.on('message', (message) => {
        console.log("Received:", message); // Логируем полученное сообщение

        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                console.log("Sending:", message);  // Логируем отправку сообщения
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
    });
});

console.log("WebSocket сервер запущен на ws://localhost:8080");

