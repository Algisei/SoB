const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

let users = []; // Массив для хранения имен пользователей и их идентификаторов

io.on('connection', (socket) => {
  console.log('a user connected');

  // Генерируем уникальный идентификатор на основе времени
  const uniqueId = `User-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const username = `User${users.length + 1}`;
  
  // Добавляем пользователя в массив
  users.push({ username, uniqueId });

  // Отправляем обновленный список пользователей всем клиентам
  io.emit('userListUpdate', users);

  socket.on('message', (message) => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    // Удаляем пользователя при отключении
    users = users.filter(user => user.uniqueId !== uniqueId);

    // Отправляем обновленный список пользователей всем клиентам
    io.emit('userListUpdate', users);
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});
