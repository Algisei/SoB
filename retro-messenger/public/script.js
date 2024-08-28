document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.querySelector('.message-form');
    const textarea = messageForm.querySelector('textarea');
    const messageList = document.querySelector('.message-list');
    const threadList = document.querySelector('.thread-list');
    const userIdSpan = document.getElementById('user-id');

    // Генерация случайного идентификатора пользователя
    const userId = 'user_' + Math.random().toString(36).substr(2, 9);
    userIdSpan.textContent = userId;  // Отображение идентификатора на странице

    // Подключение к WebSocket серверу
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

    // Отправка нового сообщения
    messageForm.querySelector('button').addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            ws.send(JSON.stringify({ type: 'message', userId, message }));
            textarea.value = ''; // Очистка поля после отправки
        }
    });

    // Функция для добавления сообщения в список
    function addMessageToList(message) {
        const messageElement = document.createElement('div');
        messageElement.textContent = `[${message.timestamp}] ${message.userId}: ${message.message}`;
        messageList.appendChild(messageElement);
        messageList.scrollTop = messageList.scrollHeight; // Прокрутка вниз к последнему сообщению
    }

    // Треды
    const threads = ['Thread 1', 'Thread 2', 'Thread 3'];
    threads.forEach(thread => {
        const threadElement = document.createElement('div');
        threadElement.textContent = thread;
        threadList.appendChild(threadElement);
    });
});
