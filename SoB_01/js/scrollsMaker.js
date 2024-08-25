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
        document.getElementById('menu').style.display = 'block';
        loadModes();
    });
    editor.appendChild(closeButton);

    const slotSelect = document.createElement('select');
    slotSelect.style.width = '100%';
    slotSelect.style.marginBottom = '10px';
    const slotNames = ['one_slot', 'two_slot', 'three_slot', 'four_slot', 'five_slot', 'six_slot', 'seven_slot', 'eight_slot', 'nine_slot', 'zero_slot'];
    for (let i = 0; i < slotNames.length; i++) {
        const option = document.createElement('option');
        option.value = i + 1;
        option.textContent = `Слот ${i + 1} (${slotNames[i]})`;
        slotSelect.appendChild(option);
    }
    slotSelect.addEventListener('change', () => {
        const slot = parseInt(slotSelect.value);
        if (bulletModes[slot]) {
            const mode = bulletModes[slot];
            const formula = mode.trajectory.toString();
            formulaInput.value = formula.substring(formula.indexOf('{') + 1, formula.lastIndexOf('}')).trim();
            colorInput.value = `#${mode.color.toString(16).padStart(6, '0')}`;
            sizeInput.value = mode.size;
            lifetimeInput.value = mode.lifetime;
            formulaDisplay.textContent = formulaInput.value;
            updateDemoDisplay();
        } else {
            formulaInput.value = '';
            colorInput.value = '#ff0000';
            sizeInput.value = '';
            lifetimeInput.value = '';
            formulaDisplay.textContent = '';
        }
    });
    editor.appendChild(slotSelect);

    const textareaCanvasContainer = document.createElement('div');
    textareaCanvasContainer.style.display = 'flex';
    textareaCanvasContainer.style.justifyContent = 'space-between';
    textareaCanvasContainer.style.marginBottom = '10px';
    editor.appendChild(textareaCanvasContainer);

    const formulaDisplay = document.createElement('div');
    formulaDisplay.id = 'formulaDisplay';
    formulaDisplay.style.marginBottom = '10px';
    formulaDisplay.style.background = '#222';
    formulaDisplay.style.color = '#0f0';
    formulaDisplay.style.padding = '10px';
    formulaDisplay.style.height = '100px';
    formulaDisplay.style.overflowY = 'auto';
    editor.appendChild(formulaDisplay);

    const formulaInput = document.createElement('textarea');
    formulaInput.placeholder = 'Введите тело функции траектории (например, bullet.x += bullet.vx * delta;)';
    formulaInput.style.width = '48%';
    formulaInput.style.height = '300px';
    formulaInput.style.marginBottom = '10px';
    formulaInput.style.resize = 'none';
    formulaInput.addEventListener('input', () => {
        formulaDisplay.textContent = formulaInput.value;
        updateDemoDisplay();
    });
    textareaCanvasContainer.appendChild(formulaInput);

    const demoCanvas = document.createElement('canvas');
    demoCanvas.id = 'demoCanvas';
    demoCanvas.width = 400;
    demoCanvas.height = 300;
    demoCanvas.style.background = '#222';
    demoCanvas.style.color = '#0f0';
    textareaCanvasContainer.appendChild(demoCanvas);

    let scale = 1;
    const zoomInButton = document.createElement('button');
    zoomInButton.innerText = '+';
    zoomInButton.style.position = 'absolute';
    zoomInButton.style.top = '10px';
    zoomInButton.style.right = '50px';
    zoomInButton.style.padding = '5px';
    zoomInButton.style.background = 'green';
    zoomInButton.style.color = 'white';
    zoomInButton.style.border = 'none';
    zoomInButton.style.cursor = 'pointer';
    zoomInButton.title = 'Увеличить масштаб';
    zoomInButton.addEventListener('click', () => {
        scale += 0.1;
        updateDemoDisplay();
    });
    editor.appendChild(zoomInButton);

    const zoomOutButton = document.createElement('button');
    zoomOutButton.innerText = '-';
    zoomOutButton.style.position = 'absolute';
    zoomOutButton.style.top = '10px';
    zoomOutButton.style.right = '10px';
    zoomOutButton.style.padding = '5px';
    zoomOutButton.style.background = 'green';
    zoomOutButton.style.color = 'white';
    zoomOutButton.style.border = 'none';
    zoomOutButton.style.cursor = 'pointer';
    zoomOutButton.title = 'Уменьшить масштаб';
    zoomOutButton.addEventListener('click', () => {
        if (scale > 0.1) {
            scale -= 0.1;
            updateDemoDisplay();
        }
    });
    editor.appendChild(zoomOutButton);

    function updateDemoDisplay() {
        const context = demoCanvas.getContext('2d');
        context.clearRect(0, 0, demoCanvas.width, demoCanvas.height);
    
        const demoText = formulaInput.value.trim();
    
        if (demoText === '') {
            // Если формула отсутствует, ничего не отображать
            formulaDisplay.textContent = '';
            return;
        }
    
        try {
            const demoFunction = new Function('bullet', 'delta', demoText);
            let bullet = { x: demoCanvas.width / 2, y: demoCanvas.height / 2, vx: 5, vy: 5, age: 0 };
    
            function animateBullet() {
                context.clearRect(0, 0, demoCanvas.width, demoCanvas.height);
                context.save();
                context.translate(demoCanvas.width / 2, demoCanvas.height / 2);
                context.scale(scale, scale);
                context.translate(-demoCanvas.width / 2, -demoCanvas.height / 2);
    
                try {
                    demoFunction(bullet, 1);
                    context.beginPath();
                    context.arc(bullet.x, bullet.y, parseInt(sizeInput.value) || 5, 0, 2 * Math.PI);
                    context.fillStyle = colorInput.value;
                    context.fill();
                    bullet.age += 1;
                    context.restore();
    
                    if (bullet.age <= (parseInt(lifetimeInput.value) || 100)) {
                        requestAnimationFrame(animateBullet);
                    } else {
                        bullet.age = 0; // Reset bullet age for looped animation
                        bullet.x = demoCanvas.width / 2;
                        bullet.y = demoCanvas.height / 2;
                        requestAnimationFrame(animateBullet);
                    }
                } catch (error) {
                    // Отображаем сообщение об ошибке в formulaDisplay
                    formulaDisplay.textContent = `Ошибка в функции траектории: ${error.message}`;
                    context.restore();
                    return;
                }
            }
    
            animateBullet();
            formulaDisplay.textContent = demoText; // Обновляем содержимое formulaDisplay при успешном выполнении
        } catch (error) {
            // Отображаем сообщение об ошибке в formulaDisplay
            formulaDisplay.textContent = `Ошибка: ${error.message}`;
        }
    }
    
    

    updateDemoDisplay();

    const tabContainer = document.createElement('div');
    tabContainer.style.display = 'flex';
    tabContainer.style.marginBottom = '10px';
    editor.appendChild(tabContainer);

    const tabs = ['Тригонометрия и операторы', 'Траектории', 'Настройки'];
    const tabContents = {};

    tabs.forEach(tab => {
        const tabButton = document.createElement('button');
        tabButton.innerText = tab;
        tabButton.style.flex = '1';
        tabButton.style.padding = '10px';
        tabButton.style.cursor = 'pointer';
        tabButton.style.background = '#333';
        tabButton.style.color = '#0f0';
        tabButton.style.border = '1px solid #0f0';
        tabButton.addEventListener('click', () => {
            Object.keys(tabContents).forEach(key => {
                tabContents[key].style.display = key === tab ? 'block' : 'none';
            });
        });
        tabContainer.appendChild(tabButton);

        const tabContent = document.createElement('div');
        tabContent.style.display = tab === 'Тригонометрия и операторы' ? 'block' : 'none';
        tabContent.style.marginBottom = '10px';
        tabContents[tab] = tabContent;
        editor.appendChild(tabContent);
    });

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
        { text: ')', value: ')', title: 'Закрывающая скобка' }
    ];

    const geoButtons = [
        { text: 'Круг', value: 'bullet.x += Math.cos(bullet.age / 10) * delta; bullet.y += Math.sin(bullet.age / 10) * delta;', title: 'Круговая траектория' },
        { text: 'Спираль', value: 'bullet.x += bullet.age * Math.cos(bullet.age / 10) * delta; bullet.y += bullet.age * Math.sin(bullet.age / 10) * delta;', title: 'Спиральная траектория' },
        { text: 'Синусоида', value: 'bullet.y += Math.sin(bullet.x / 10) * delta;', title: 'Синусоидальная траектория' },
        { text: 'Зигзаг', value: 'bullet.x += bullet.vx * delta; bullet.y += Math.sin(bullet.x / 10) * bullet.vy * delta;', title: 'Зигзагообразная траектория' }
    ];

    const createButtons = (buttons, container) => {
        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.innerText = button.text;
            btn.style.width = '23%';
            btn.style.margin = '1%';
            btn.title = button.title;
            btn.addEventListener('click', () => {
                formulaInput.value += button.value;
                formulaDisplay.textContent = formulaInput.value;
                updateDemoDisplay();
            });
            container.appendChild(btn);
        });
    };

    const trigButtonsContainer = document.createElement('div');
    trigButtonsContainer.style.display = 'flex';
    trigButtonsContainer.style.flexWrap = 'wrap';
    createButtons(trigButtons, trigButtonsContainer);
    tabContents['Тригонометрия и операторы'].appendChild(trigButtonsContainer);

    const geoButtonsContainer = document.createElement('div');
    geoButtonsContainer.style.display = 'flex';
    geoButtonsContainer.style.flexWrap = 'wrap';
    createButtons(geoButtons, geoButtonsContainer);
    tabContents['Траектории'].appendChild(geoButtonsContainer);

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = '#ff0000';
    colorInput.style.marginBottom = '10px';
    colorInput.title = 'Цвет пули';
    tabContents['Настройки'].appendChild(colorInput);

    const sizeInput = document.createElement('input');
    sizeInput.type = 'number';
    sizeInput.placeholder = 'Размер';
    sizeInput.style.marginBottom = '10px';
    sizeInput.title = 'Размер пули';
    tabContents['Настройки'].appendChild(sizeInput);

    const lifetimeInput = document.createElement('input');
    lifetimeInput.type = 'number';
    lifetimeInput.placeholder = 'Время жизни';
    lifetimeInput.style.marginBottom = '10px';
    lifetimeInput.title = 'Время жизни пули';
    tabContents['Настройки'].appendChild(lifetimeInput);

    const saveButton = document.createElement('button');
saveButton.innerText = 'Сохранить';
saveButton.style.marginBottom = '10px';
saveButton.title = 'Сохранить текущую настройку';
saveButton.addEventListener('click', () => {
    const trajectoryFunctionText = `function(bullet, delta) { ${formulaInput.value.trim()} }`;

    try {
        const trajectoryFunction = new Function('return ' + trajectoryFunctionText)();
        // Проверяем выполнение функции
        trajectoryFunction({ x: 0, y: 0, vx: 0, vy: 0, age: 0 }, 1);

        const slot = parseInt(slotSelect.value);
        bulletModes[slot] = {
            trajectory: trajectoryFunction,
            color: parseInt(colorInput.value.slice(1), 16),
            size: parseInt(sizeInput.value),
            lifetime: parseInt(lifetimeInput.value)
        };

        saveModes();
        alert(`Настройка для слота ${slot} сохранена.`);
    } catch (error) {
        // Отображаем сообщение об ошибке в formulaDisplay
        formulaDisplay.textContent = `Ошибка в формуле: ${error.message}`;
    }
});
tabContents['Настройки'].appendChild(saveButton);


    document.body.appendChild(editor);
    isPaused = true;
    document.getElementById('menu').style.display = 'none';

    function loadModes() {
        const savedModes = JSON.parse(localStorage.getItem('bulletModes'));
        if (savedModes) {
            for (let i = 1; i <= 10; i++) {
                if (savedModes[i]) {
                    bulletModes[i] = {
                        trajectory: new Function('return ' + savedModes[i].trajectory)(),
                        color: savedModes[i].color,
                        size: savedModes[i].size,
                        lifetime: savedModes[i].lifetime
                    };
                }
            }
        }
    }

    function saveModes() {
        const modesToSave = {};
        for (let i = 1; i <= 10; i++) {
            if (bulletModes[i]) {
                modesToSave[i] = {
                    trajectory: bulletModes[i].trajectory.toString(),
                    color: bulletModes[i].color,
                    size: bulletModes[i].size,
                    lifetime: bulletModes[i].lifetime
                };
            }
        }
        localStorage.setItem('bulletModes', JSON.stringify(modesToSave));
    }

    // Устанавливаем первый слот по умолчанию и обновляем отображение
    slotSelect.value = '1';
    slotSelect.dispatchEvent(new Event('change'));
}
