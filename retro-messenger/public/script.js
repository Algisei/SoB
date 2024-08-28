// script.js
document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.querySelector('.message-form');
    const textarea = messageForm.querySelector('textarea');
    const messageList = document.querySelector('.message-list');
    const threadList = document.querySelector('.thread-list');

    const ws = new WebSocket('wss://retro-messenger.onrender.com');

    // Обработка входящих сообщений
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'initial') {
            data.messages.forEach(message => addMessageToList(message));
        } else if (data.type === 'message') {
            addMessageToList(data.message);
        }
    };

    messageForm.querySelector('button').addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            const userId = 'user123'; // Или генерируйте уникальный идентификатор для пользователя
            ws.send(JSON.stringify({ type: 'message', userId, message }));
            textarea.value = '';
        }
    });

    function addMessageToList(message) {
        const messageElement = document.createElement('div');
        messageElement.textContent = `[${message.timestamp}] ${message.userId}: ${message.message}`;
        messageList.appendChild(messageElement);
        messageList.scrollTop = messageList.scrollHeight;
    }

    // Примерные потоки
    const threads = ['Thread 1', 'Thread 2', 'Thread 3'];
    threads.forEach(thread => {
        const threadElement = document.createElement('div');
        threadElement.textContent = thread;
        threadList.appendChild(threadElement);
    });
});
