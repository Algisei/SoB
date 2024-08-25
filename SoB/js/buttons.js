// Создаем стиль с помощью JavaScript
const style = document.createElement('style');
style.textContent = `
    body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f0f0f0;
        margin: 0;
    }

    .diaphragm {
        position: relative;
        width: 100px;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background-color: #333;
        overflow: hidden;
        cursor: pointer;
    }

    .segment {
        position: absolute;
        width: 50%;
        height: 50%;
        background-color: #4CAF50;
        transition: transform 0.3s ease;
    }

    #segment1 {
        transform: rotate(45deg) translateX(100%);
        transform-origin: 100% 100%;
    }

    #segment2 {
        transform: rotate(135deg) translateY(100%);
        transform-origin: 0% 100%;
    }

    #segment3 {
        transform: rotate(-135deg) translateX(-100%);
        transform-origin: 0% 0%;
    }

    #segment4 {
        transform: rotate(-45deg) translateY(-100%);
        transform-origin: 100% 0%;
    }

    .diaphragm:hover .segment {
        transform: rotate(0deg) translate(0, 0);
    }
`;
document.head.appendChild(style);

// Создаем контейнер для диафрагмы
const app = document.getElementById('app');

const diaphragm = document.createElement('div');
diaphragm.className = 'diaphragm';

// Создаем сегменты
const segments = ['segment1', 'segment2', 'segment3', 'segment4'];
segments.forEach(id => {
    const segment = document.createElement('div');
    segment.className = 'segment';
    segment.id = id;
    diaphragm.appendChild(segment);
});

app.appendChild(diaphragm);

// Добавляем обработчики событий для сегментов
document.querySelectorAll('.segment').forEach(segment => {
    segment.addEventListener('click', () => {
        alert(`Нажата кнопка ${segment.id}`);
    });
});