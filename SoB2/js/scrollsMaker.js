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
        tabContent.style.background = '#333';
        tabContent.style.color = '#0f0';
        tabContent.style.padding = '10px';
        tabContent.style.border = '1px solid #0f0';
        editor.appendChild(tabContent);

        tabContents[tab] = tabContent;
    });

    const trigonomertyOperatorsTab = tabContents['Тригонометрия и операторы'];
    const trajectoryTab = tabContents['Траектории'];
    const settingsTab = tabContents['Настройки'];

    // Тригонометрия и операторы
    const operatorsList = [
        'Math.sin(x)',
        'Math.cos(x)',
        'Math.tan(x)',
        'Math.asin(x)',
        'Math.acos(x)',
        'Math.atan(x)',
        'Math.atan2(y, x)',
        'Math.sqrt(x)',
        'Math.pow(x, y)',
        'Math.abs(x)',
        'Math.floor(x)',
        'Math.ceil(x)',
        'Math.round(x)',
        'Math.random()',
        'Math.PI',
    ];
    operatorsList.forEach(op => {
        const operatorButton = document.createElement('button');
        operatorButton.innerText = op;
        operatorButton.style.width = '100%';
        operatorButton.style.marginBottom = '5px';
        operatorButton.style.padding = '5px';
        operatorButton.style.cursor = 'pointer';
        operatorButton.style.background = '#444';
        operatorButton.style.color = '#0f0';
        operatorButton.style.border = '1px solid #0f0';
        operatorButton.addEventListener('click', () => {
            formulaInput.value += op + ' ';
            formulaDisplay.textContent = formulaInput.value;
        });
        trigonomertyOperatorsTab.appendChild(operatorButton);
    });

    // Траектории
    const trajectoryPresets = [
        { name: 'Прямая', code: 'bullet.x += bullet.vx * delta;' },
        { name: 'Круг', code: 'bullet.x += Math.cos(bullet.age / 50) * 5;\nbullet.y += Math.sin(bullet.age / 50) * 5;' },
        { name: 'Волна', code: 'bullet.x += bullet.vx * delta;\nbullet.y += Math.sin(bullet.x / 20) * 5;' },
        { name: 'Спираль', code: 'bullet.x += Math.cos(bullet.age / 50) * bullet.age / 100;\nbullet.y += Math.sin(bullet.age / 50) * bullet.age / 100;' },
        { name: 'Зигзаг', code: 'bullet.x += bullet.vx * delta;\nif (bullet.age % 20 < 10) {\n    bullet.y += 5;\n} else {\n    bullet.y -= 5;\n}' },
    ];
    trajectoryPresets.forEach(preset => {
        const presetButton = document.createElement('button');
        presetButton.innerText = preset.name;
        presetButton.style.width = '100%';
        presetButton.style.marginBottom = '5px';
        presetButton.style.padding = '5px';
        presetButton.style.cursor = 'pointer';
        presetButton.style.background = '#444';
        presetButton.style.color = '#0f0';
        presetButton.style.border = '1px solid #0f0';
        presetButton.addEventListener('click', () => {
            formulaInput.value = preset.code;
            formulaDisplay.textContent = formulaInput.value;
            updateDemoDisplay();
        });
        trajectoryTab.appendChild(presetButton);
    });

    // Настройки
    const colorLabel = document.createElement('label');
    colorLabel.innerText = 'Цвет пули:';
    colorLabel.style.marginBottom = '5px';
    colorLabel.style.display = 'block';
    settingsTab.appendChild(colorLabel);

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = '#ff0000';
    colorInput.style.marginBottom = '10px';
    settingsTab.appendChild(colorInput);

    const sizeLabel = document.createElement('label');
    sizeLabel.innerText = 'Размер пули:';
    sizeLabel.style.marginBottom = '5px';
    sizeLabel.style.display = 'block';
    settingsTab.appendChild(sizeLabel);

    const sizeInput = document.createElement('input');
    sizeInput.type = 'number';
    sizeInput.value = '5';
    sizeInput.style.marginBottom = '10px';
    sizeInput.style.width = '100%';
    settingsTab.appendChild(sizeInput);

    const lifetimeLabel = document.createElement('label');
    lifetimeLabel.innerText = 'Время жизни пули:';
    lifetimeLabel.style.marginBottom = '5px';
    lifetimeLabel.style.display = 'block';
    settingsTab.appendChild(lifetimeLabel);

    const lifetimeInput = document.createElement('input');
    lifetimeInput.type = 'number';
    lifetimeInput.value = '100';
    lifetimeInput.style.marginBottom = '10px';
    lifetimeInput.style.width = '100%';
    settingsTab.appendChild(lifetimeInput);

    const saveButton = document.createElement('button');
    saveButton.innerText = 'Сохранить изменения';
    saveButton.style.padding = '10px';
    saveButton.style.cursor = 'pointer';
    saveButton.style.background = 'green';
    saveButton.style.color = 'white';
    saveButton.style.border = 'none';
    saveButton.addEventListener('click', () => {
        const slot = parseInt(slotSelect.value);
        if (slot) {
            const trajectoryCode = `function(bullet, delta) {\n${formulaInput.value.trim()}\n}`;
            bulletModes[slot] = {
                trajectory: new Function('bullet', 'delta', formulaInput.value),
                color: parseInt(colorInput.value.substring(1), 16),
                size: parseInt(sizeInput.value),
                lifetime: parseInt(lifetimeInput.value)
            };
            localStorage.setItem('bulletModes', JSON.stringify(bulletModes));
            alert(`Мод для слота ${slot} сохранен!`);
        } else {
            alert('Пожалуйста, выберите слот.');
        }
    });
    settingsTab.appendChild(saveButton);

    document.body.appendChild(editor);
    isPaused = true;
    document.getElementById('menu').style.display = 'none';
    clearGameState(); // Остановка игры
}
