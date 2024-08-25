// script.js
document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.querySelector('.message-form');
    const textarea = messageForm.querySelector('textarea');
    const messageList = document.querySelector('.message-list');
    const threadList = document.querySelector('.thread-list');

    messageForm.querySelector('button').addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            addMessageToList(message);
            textarea.value = '';
        }
    });

    function addMessageToList(message) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageList.appendChild(messageElement);
        messageList.scrollTop = messageList.scrollHeight;
    }

    // Example threads
    const threads = ['Thread 1', 'Thread 2', 'Thread 3'];
    threads.forEach(thread => {
        const threadElement = document.createElement('div');
        threadElement.textContent = thread;
        threadList.appendChild(threadElement);
    });
});
