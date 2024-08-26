// // server.js
// const WebSocket = require('ws');

// const server = new WebSocket.Server({ port: 8080 });

// let clients = [];

// server.on('connection', (ws) => {
//     clients.push(ws);

//     ws.on('message', (message) => {
//         console.log("Received:", message); // Логируем полученное сообщение

//         clients.forEach(client => {
//             if (client !== ws && client.readyState === WebSocket.OPEN) {
//                 console.log("Sending:", message);  // Логируем отправку сообщения
//                 client.send(message);
//             }
//         });
//     });

//     ws.on('close', () => {
//         clients = clients.filter(client => client !== ws);
//     });
// });

// console.log("WebSocket сервер запущен на ws://localhost:8080");

let clients = [];

function sendToAllClients(data) {
    clients.forEach(client => client.write(`data: ${JSON.stringify(data)}\n\n`));
}

module.exports = (req, res) => {
    if (req.method === 'GET') {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        clients.push(res);

        req.on('close', () => {
            clients = clients.filter(client => client !== res);
        });
    } else if (req.method === 'POST') {
        let data = '';

        req.on('data', chunk => {
            data += chunk;
        });

        req.on('end', () => {
            sendToAllClients(JSON.parse(data));
            res.status(200).end();
        });
    } else {
        res.status(405).end();
    }
};
