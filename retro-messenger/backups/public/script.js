document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.querySelector('.message-form');
    const textarea = messageForm.querySelector('textarea');
    const messageList = document.querySelector('.message-list');
    const threadList = document.querySelector('.thread-list');
    const userIdElement = document.getElementById('user-id');

    const userId = 'User-' + Date.now();
    userIdElement.textContent = `(${userId})`;

    messageForm.querySelector('button').addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            sendMessage(message, userId);
            textarea.value = '';
        }
    });

    function addMessageToList(messageData) {
        const messageElement = document.createElement('div');
        messageElement.textContent = `[${messageData.timestamp}] ${messageData.userId}: ${messageData.message}`;
        messageList.appendChild(messageElement);
        messageList.scrollTop = messageList.scrollHeight;
    }

    function sendMessage(message, userId) {
        fetch('/api/server', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, userId }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'Message sent') {
                console.log('Message sent successfully');
            }
        })
        .catch(error => {
            console.error('Error sending message:', error);
        });
    }

    function pollForMessages() {
        fetch('/api/server')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.messages && data.messages.length > 0) {
                    data.messages.forEach(addMessageToList);
                } else if (data.message) {
                    addMessageToList(data.message);
                }
                setTimeout(pollForMessages, 10);  // Ожидание 1 секунды перед следующим запросом
            })
            .catch(error => {
                console.error('Error fetching messages:', error);
                setTimeout(pollForMessages, 100);  // Повтор через 10 секунд в случае ошибки
            });
    }

    pollForMessages();

    const threads = ['Thread 1', 'Thread 2', 'Thread 3'];
    threads.forEach(thread => {
        const threadElement = document.createElement('div');
        threadElement.textContent = thread;
        threadList.appendChild(threadElement);
    });
});
