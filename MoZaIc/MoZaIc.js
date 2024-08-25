function generateMosaic(numElements) {
    // Очистка предыдущих элементов, если они есть
    app.stage.removeChildren();

    for (let i = 0; i < numElements; i++) {
        // Создание случайного элемента (графики)
        let graphics = new PIXI.Graphics();
        let size = 50; // размер элемента

        // Случайный цвет
        let color = Math.random() * 0xFFFFFF;
        graphics.beginFill(color);
        
        // Случайная форма (прямоугольник или круг)
        if (Math.random() > 0.5) {
            graphics.drawRect(0, 0, size, size);
        } else {
            graphics.drawCircle(size / 2, size / 2, size / 2);
        }

        graphics.endFill();

        // Расположение элемента в случайном месте на холсте
        graphics.x = Math.random() * (app.renderer.width - size);
        graphics.y = Math.random() * (app.renderer.height - size);

        // Добавление элемента на сцену
        app.stage.addChild(graphics);

        // Добавление обработчика событий для клика по элементу
        graphics.interactive = true;
        graphics.buttonMode = true;
        graphics.on('pointerdown', () => {
            // Проверка, является ли этот элемент нужным
            if (graphics === correctElement) {
                // Если нашли нужный элемент
                if (numElements < 300) {
                    generateMosaic(numElements + 10); // увеличение числа элементов
                } else {
                    alert("Вы прошли все уровни!");
                }
            }
        });

        // Определение элемента, который нужно найти
        if (i === Math.floor(Math.random() * numElements)) {
            var correctElement = graphics;
        }
    }
}

// Генерация первой мозаики с начальным числом элементов
generateMosaic(10);
