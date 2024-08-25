function showScrollsMaker() {
    const editor = document.createElement('div');
    editor.id = 'scrollsMakerEditor';
    editor.style.position = 'absolute';
    editor.style.top = '50%';
    editor.style.left = '50%';
    editor.style.transform = 'translate(-50%, -50%)';
    editor.style.background = 'black';
    editor.style.color = 'green';
    editor.style.fontFamily = 'Courier New, Courier, monospace';
    editor.style.padding = '20px';
    editor.style.border = '2px solid green';
    editor.style.zIndex = '1000';
    editor.style.width = '800px';
    editor.style.height = '600px';
    editor.style.display = 'flex';
    editor.style.flexDirection = 'column';

    // Close button
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Закрыть';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.padding = '5px';
    closeButton.style.background = 'green';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.title = 'Закрыть редактор';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(editor);
        isPaused = false;
        document.getElementById('menu').style.display = 'block'; // Show the main menu
    });
    editor.appendChild(closeButton);

    // Slot selection dropdown
    const slotSelect = document.createElement('select');
    slotSelect.style.width = '100%';
    slotSelect.style.marginBottom = '10px';
    for (let i = 1; i <= 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Слот ${i}`;
        slotSelect.appendChild(option);
    }
    slotSelect.addEventListener('change', () => {
        const slot = parseInt(slotSelect.value);
        if (bulletModes[slot]) {
            const mode = bulletModes[slot];
            formulaInput.value = mode.trajectory.toString().replace(/^function\s*?\(bullet,\s*delta\)\s*?{/, '').replace(/}$/, '').trim();
            colorInput.value = `#${mode.color.toString(16).padStart(6, '0')}`;
            sizeInput.value = mode.size;
            lifetimeInput.value = mode.lifetime;
            formulaDisplay.textContent = formulaInput.value;
        } else {
            formulaInput.value = '';
            colorInput.value = '#ff0000';
            sizeInput.value = '';
            lifetimeInput.value = '';
            formulaDisplay.textContent = '';
        }
    });
    editor.appendChild(slotSelect);

    // Formula display area
    const formulaDisplay = document.createElement('div');
    formulaDisplay.id = 'formulaDisplay';
    formulaDisplay.style.marginBottom = '10px';
    formulaDisplay.style.background = '#222';
    formulaDisplay.style.color = '#0f0';
    formulaDisplay.style.padding = '10px';
    formulaDisplay.style.height = '100px';
    formulaDisplay.style.overflowY = 'auto';
    editor.appendChild(formulaDisplay);

    // Formula input textarea
    const formulaInput = document.createElement('textarea');
    formulaInput.placeholder = 'Введите формулу траектории (например, fractalPattern(bullet, delta))';
    formulaInput.style.width = '48%';
    formulaInput.style.height = '300px';
    formulaInput.style.marginBottom = '10px';
    formulaInput.addEventListener('input', () => {
        formulaDisplay.textContent = formulaInput.value;
        updateDemoDisplay(); // Update demo display on input change
    });
    editor.appendChild(formulaInput);

    // Demo display area
    const demoDisplay = document.createElement('div');
    demoDisplay.id = 'demoDisplay';
    demoDisplay.style.width = '48%';
    demoDisplay.style.height = '300px';
    demoDisplay.style.background = '#222';
    demoDisplay.style.color = '#0f0';
    demoDisplay.style.padding = '10px';
    formulaInput.style.marginBottom = '10px';
    demoDisplay.style.marginLeft = '4%';

    const demoText = document.createElement('div');
    demoText.style.marginBottom = '10px';
    demoText.textContent = 'Демо анимации:';
    demoDisplay.appendChild(demoText);
    editor.appendChild(demoDisplay);

    // Function to update demo display based on formula input
    function updateDemoDisplay() {
        const demoText = formulaInput.value.trim();
        try {
            const demoFunction = new Function('bullet', 'delta', demoText);

            // Simulate demo animation
            let bullet = { x: 0, y: 0, vx: 5, vy: 5, age: 0 }; // Example initial bullet parameters
            demoDisplay.textContent = `x: ${bullet.x.toFixed(2)}, y: ${bullet.y.toFixed(2)}`;
            const demoAnimationInterval = setInterval(() => {
                demoFunction(bullet, 1); // Call the demo function with bullet and delta
                demoDisplay.textContent = `x: ${bullet.x.toFixed(2)}, y: ${bullet.y.toFixed(2)}`;
                bullet.age += 1;
                if (bullet.age > 100) {
                    clearInterval(demoAnimationInterval);
                }
            }, 100); // Update interval in milliseconds
        } catch (error) {
            demoDisplay.textContent = `Ошибка: ${error.message}`;
        }
    }

    // Initial call to update demo display
    updateDemoDisplay();

    // Adding visual buttons for formula building
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexWrap = 'wrap';
    buttonContainer.style.marginBottom = '10px';

    const trigButtons = [
        { text: 'sin', value: 'Math.sin(', title: 'Синус' },
        { text: 'cos', value: 'Math.cos(', title: 'Косинус' },
        { text: 'tan', value: 'Math.tan(', title: 'Тангенс' },
        { text: 'PI', value: 'Math.PI', title: 'Число PI' },
        { text: 'x', value: 'bullet.x', title: 'Координата X пули' },
        { text: 'y', value: 'bullet.y', title: 'Координата Y пули' },
        { text: 'vx', value: 'bullet.vx', title: 'Скорость по X' },
        { text: 'vy', value: 'bullet.vy', title: 'Скорость по Y' },
        { text: 'age', value: 'bullet.age', title: 'Возраст пули' },
        { text: 'delta', value: 'delta', title: 'Шаг времени' },
        { text: '+', value: '+', title: 'Сложение' },
        { text: '-', value: '-', title: 'Вычитание' },
        { text: '*', value: '*', title: 'Умножение' },
        { text: '/', value: '/', title: 'Деление' },
        { text: '(', value: '(', title: 'Открывающая скобка' },
        { text: ')', value: ')', title: 'Закрывающая скобка' },
        { text: 'f=', value: 'function(bullet, delta) { return ; }', title: 'Шаблон функции' } // Template function
    ];

    trigButtons.forEach(button => {
        const trigButton = document.createElement('button');
        trigButton.innerText = button.text;
        trigButton.style.width = '10%';
        trigButton.style.margin = '1%';
        trigButton.title = button.title;
        trigButton.addEventListener('click', () => {
            const cursorPosition = formulaInput.selectionStart;
            const textBeforeCursor = formulaInput.value.substring(0, cursorPosition);
            const textAfterCursor = formulaInput.value.substring(cursorPosition);
            formulaInput.value = textBeforeCursor + button.value + textAfterCursor;
            formulaInput.focus();
            formulaInput.selectionStart = cursorPosition + button.value.length;
            formulaInput.selectionEnd = cursorPosition + button.value.length;
            formulaDisplay.textContent = formulaInput.value;
            updateDemoDisplay(); // Update demo display on button click
        });
        buttonContainer.appendChild(trigButton);
    });

    editor.appendChild(buttonContainer);

    // Buttons for geometric patterns
    const geoButtonsContainer = document.createElement('div');
    geoButtonsContainer.style.display = 'flex';
    geoButtonsContainer.style.flexWrap = 'wrap';
    geoButtonsContainer.style.marginBottom = '10px';

    const geoButtons = [
        { text: 'Круг', value: 'function(bullet, delta) { bullet.x += Math.cos(bullet.age / 10) * delta; bullet.y += Math.sin(bullet.age / 10) * delta; }', title: 'Круговая траектория' },
        { text: 'Спираль', value: 'function(bullet, delta) { bullet.x += bullet.age * Math.cos(bullet.age / 10) * delta; bullet.y += bullet.age * Math.sin(bullet.age / 10) * delta; }', title: 'Спиральная траектория' },
        { text: 'Восьмерка', value: 'function(bullet, delta) { bullet.x += Math.sin(bullet.age / 10) * delta; bullet.y += Math.sin(bullet.age / 5) * delta; }', title: 'Траектория в виде восьмерки' },
        { text: 'Парабола', value: 'function(bullet, delta) { bullet.x += bullet.age * delta; bullet.y += Math.pow(bullet.age, 2) * delta; }', title: 'Параболическая траектория' },
        ...Array.from({ length: 10 }, (_, i) => {
            const n = i + 3;
            const angle = Math.PI * 2 / n;
            const formula = `
                function(bullet, delta) {
                    const t = bullet.age * delta;
                    const r = 100;
                    bullet.x = r * Math.cos(t * ${angle}) * delta;
                    bullet.y = r * Math.sin(t * ${angle}) * delta;
                }`;
            return { text: `${n}-угольник`, value: formula.trim(), title: `Траектория ${n}-угольника` };
        })
    ];

    geoButtons.forEach(button => {
        const geoButton = document.createElement('button');
        geoButton.innerText = button.text;
        geoButton.style.width = '10%';
        geoButton.style.margin = '1%';
        geoButton.title = button.title;
        geoButton.addEventListener('click', () => {
            formulaInput.value = button.value;
            formulaDisplay.textContent = formulaInput.value;
            updateDemoDisplay(); // Update demo display on button click
        });
        geoButtonsContainer.appendChild(geoButton);
    });

    editor.appendChild(geoButtonsContainer);

    // Color input
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = '#ff0000';
    colorInput.style.marginBottom = '10px';
    colorInput.title = 'Выберите цвет пули';
    editor.appendChild(colorInput);

    // Size input
    const sizeInput = document.createElement('input');
    sizeInput.type = 'number';
    sizeInput.placeholder = 'Размер пули';
    sizeInput.style.marginBottom = '10px';
    sizeInput.title = 'Введите размер пули';
    editor.appendChild(sizeInput);

    // Lifetime input
    const lifetimeInput = document.createElement('input');
    lifetimeInput.type = 'number';
    lifetimeInput.placeholder = 'Длительность полёта (мс)';
    lifetimeInput.style.marginBottom = '10px';
    lifetimeInput.title = 'Введите длительность полёта пули в миллисекундах';
    editor.appendChild(lifetimeInput);

    // Save button
    const saveButton = document.createElement('button');
    saveButton.innerText = 'Сохранить режим';
    saveButton.style.width = '100%';
    saveButton.style.padding = '10px';
    saveButton.style.background = 'green';
    saveButton.style.color = 'white';
    saveButton.style.border = 'none';
    saveButton.style.cursor = 'pointer';
    saveButton.title = 'Сохранить текущие настройки режима';
    saveButton.addEventListener('click', () => {
        const slot = parseInt(slotSelect.value);
        const trajectoryFunctionText = formulaInput.value.trim();
        const trajectoryFunction = new Function('bullet', 'delta', trajectoryFunctionText);

        bulletModes[slot] = {
            trajectory: trajectoryFunction,
            color: parseInt(colorInput.value.slice(1), 16),
            size: parseFloat(sizeInput.value),
            lifetime: parseFloat(lifetimeInput.value),
        };
        alert(`Режим для слота ${slot} сохранён!`);
    });
    editor.appendChild(saveButton);

    document.body.appendChild(editor);
}
