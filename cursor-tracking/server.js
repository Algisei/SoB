// // // server.js
// // const WebSocket = require('ws');

// // const server = new WebSocket.Server({ port: 5500 });

// // let clients = [];

// // server.on('connection', (ws) => {
// //     clients.push(ws);

// //     ws.on('message', (message) => {
// //         console.log("Received:", message); // Логируем полученное сообщение

// //         clients.forEach(client => {
// //             if (client !== ws && client.readyState === WebSocket.OPEN) {
// //                 console.log("Sending:", message);  // Логируем отправку сообщения
// //                 client.send(message);
// //             }
// //         });
// //     });

// //     ws.on('close', () => {
// //         clients = clients.filter(client => client !== ws);
// //     });
// // });

// // console.log("WebSocket сервер запущен на ws://localhost:5500");


// // server.js
// const WebSocket = require('ws');

// const server = new WebSocket.Server({ port: 5500 });

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

// console.log("WebSocket сервер запущен на ws://localhost:5500");


// server.js
const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 5500 });

let clients = [];

server.on('connection', (ws) => {
    clients.push(ws);
    console.log("New client connected");

    ws.on('message', (message) => {
        console.log("Received:", message);
        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
        console.log("Client disconnected");
    });

    ws.on('error', (error) => {
        console.error("WebSocket error:", error);
    });
});

console.log("WebSocket сервер запущен на ws://localhost:5500");
