// document.addEventListener('DOMContentLoaded', () => {
//     const messageForm = document.querySelector('.message-form');
//     const textarea = messageForm.querySelector('textarea');
//     const messageList = document.querySelector('.message-list');
    
//     const userId = `User-${Math.floor(Math.random() * 1000)}`;  // Генерация уникального идентификатора пользователя

//     // Функция для добавления сообщения в список
//     function addMessageToList(message) {
//         const messageElement = document.createElement('div');
//         messageElement.innerHTML = `<strong>${message.userId}:</strong> ${message.message} <small>${new Date(message.timestamp).toLocaleString()}</small>`;
//         messageList.appendChild(messageElement);
//         messageList.scrollTop = messageList.scrollHeight;
//     }

//     // Отправка сообщения на сервер
//     messageForm.querySelector('button').addEventListener('click', () => {
//         const message = textarea.value.trim();
//         if (message) {
//             fetch('/api/server', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ message, userId }),
//             }).then(() => {
//                 textarea.value = '';
//             });
//         }
//     });

//     // Долгий опрос для получения новых сообщений
//     function pollMessages() {
//         fetch('/api/server')
//             .then(response => response.json())
//             .then(data => {
//                 addMessageToList(data);
//                 pollMessages();  // Повторяем долгий опрос
//             })
//             .catch(() => {
//                 setTimeout(pollMessages, 5000);  // В случае ошибки повторяем запрос через 5 секунд
//             });
//     }

//     pollMessages();  // Запуск долгого опроса

//     // // Пример работы с потоками (должны быть реализованы на сервере)
//     // const threads = ['Thread 1', 'Thread 2', 'Thread 3'];
//     // threads.forEach(thread => {
//     //     const threadElement = document.createElement('div');
//     //     threadElement.textContent = thread;
//     //     threadList.appendChild(threadElement);
//     // });
// });
document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.querySelector('.message-form');
    const textarea = messageForm.querySelector('textarea');
    const messageList = document.querySelector('.message-list');
    
    const userId = `User-${Math.floor(Math.random() * 1000)}`;  // Генерация уникального идентификатора пользователя

    // Функция для добавления сообщения в список
    function addMessageToList(message) {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<strong>${message.userId}:</strong> ${message.message} <small>${new Date(message.timestamp).toLocaleString()}</small>`;
        messageList.appendChild(messageElement);
        messageList.scrollTop = messageList.scrollHeight;
    }

    // Отправка сообщения на сервер
    messageForm.querySelector('button').addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            fetch('/api/server', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, userId }),
            }).then(() => {
                textarea.value = '';
            });
        }
    });

    // Частый опрос для получения новых сообщений
    function pollMessages() {
        fetch('/api/server')
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    addMessageToList(data);
                }
                setTimeout(pollMessages, 10000);  // Увеличение интервала до 10 секунд
            })
            .catch(() => {
                setTimeout(pollMessages, 10000);  // В случае ошибки повторяем запрос через 10 секунд
            });
    }
    
    pollMessages();  // Запуск частого опроса
});
