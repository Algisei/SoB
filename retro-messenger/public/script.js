document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.querySelector('.message-form');
    const textarea = messageForm.querySelector('textarea');
    const messageList = document.querySelector('.message-list');
    const threadList = document.querySelector('.thread-list');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    messageForm.appendChild(fileInput);

    // Генерация случайного идентификатора пользователя
    const userId = 'user_' + Math.random().toString(36).substr(2, 9);

    // Подключение к WebSocket серверу
    const ws = new WebSocket('wss://retro-messenger.onrender.com');

    // Обработка входящих сообщений
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'initial') {
            data.messages.forEach(message => {
                if (message.image) {
                    addImageToList(message);
                } else {
                    addMessageToList(message);
                }
            });
        } else if (data.type === 'message') {
            addMessageToList(data.message);
        } else if (data.type === 'image') {
            addImageToList(data.image);
        }
    };

    // Отправка текстового сообщения
    messageForm.querySelector('button').addEventListener('click', sendMessage);

    // Отправка сообщения по нажатию клавиши "Enter"
    textarea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Предотвращаем перенос строки
            sendMessage();
        }
    });

    // Обработка отправки изображения
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64Image = reader.result;
                ws.send(JSON.stringify({ type: 'image', userId, image: base64Image }));
            };
            reader.readAsDataURL(file); // Конвертируем файл в Base64
        }
    });

    // Функция отправки текстового сообщения
    function sendMessage() {
        const message = textarea.value.trim();
        if (message) {
            ws.send(JSON.stringify({ type: 'message', userId, message }));
            textarea.value = '';
        }
    }

    // Добавление сообщения в список
    function addMessageToList(message) {
        const messageElement = document.createElement('div');
        messageElement.textContent = `[${message.timestamp}] ${message.userId}: ${message.message}`;
        messageList.appendChild(messageElement);
        messageList.scrollTop = messageList.scrollHeight;
    }

    // Добавление изображения в список
    function addImageToList(imageData) {
        const imageElement = document.createElement('div');
        const img = document.createElement('img');
        img.src = imageData.image;
        img.alt = `Image from ${imageData.userId}`;
        img.style.maxWidth = '100%'; // Адаптация размера изображения
        imageElement.appendChild(img);
        messageList.appendChild(imageElement);
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
