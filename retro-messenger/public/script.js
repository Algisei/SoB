document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.querySelector('.message-form');
    const textarea = messageForm.querySelector('textarea');
    const messageList = document.querySelector('.message-list');
    const threadList = document.querySelector('.thread-list');
    const userIdSpan = document.getElementById('user-id'); // Раскомментировано

    // Генерация случайного идентификатора пользователя
    const userId = generateUserId();
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

    // Отправка сообщения при клике на кнопку "Send"
    messageForm.querySelector('button').addEventListener('click', sendMessage);

    // Отправка сообщения по нажатию клавиши "Enter"
    textarea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Предотвращаем перенос строки
            sendMessage();
        }
    });

    // Функция отправки сообщения
    function sendMessage() {
        const message = textarea.value.trim();
        if (message) {
            ws.send(JSON.stringify({ type: 'message', userId, message }));
            textarea.value = '';
        }
    }

    // Генерация уникального идентификатора пользователя
    function generateUserId() {
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
            const newUserId = 'user-' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('userId', newUserId);
            return newUserId;
        }
        return storedUserId;
    }

    // Добавление сообщения в список
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
