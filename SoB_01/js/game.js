// Проверка загрузки Pixi.js
        if (typeof PIXI === 'undefined') {
            console.error('Pixi.js не загружен');
        } else {
            console.log('Pixi.js загружен');
        }

        // Создание приложения PixiJS
        const app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x1099bb,
        });

        // Убедитесь, что приложение создается корректно
        console.log("PixiJS app создан", app);

        // Добавление представления (canvas) на страницу
        document.body.appendChild(app.view);

        // Проверка добавления canvas
        if (!app.view) {
            console.error('Canvas не добавлен');
        }

        // Загрузка текстур
        const playerTexture = PIXI.Texture.from('res/player.png');
        const bulletTexture = PIXI.Texture.from('res/bullet.png');

        // Убедитесь, что текстуры загружаются корректно
        console.log("Player texture загружен", playerTexture);
        console.log("Bullet texture загружен", bulletTexture);

        // Создание игрока
        const player = new PIXI.Sprite(playerTexture);
        player.anchor.set(0.5);
        player.x = app.view.width / 2;
        player.y = app.view.height / 2;
        app.stage.addChild(player);

        // Настройка управления
        const keys = {};
        window.addEventListener('keydown', (e) => keys[e.code] = true);
        window.addEventListener('keyup', (e) => keys[e.code] = false);

        // Пули
        const bullets = [];

        // Режимы пуль
        const bulletModes = {
            1: {
                trajectory: (bullet, delta) => { bullet.x += bullet.vx; bullet.y += bullet.vy; }, // прямая линия
                color: 0xff0000, // красный (огонь)
                size: 1,
                lifetime: 1000 // 1 секунда
            },
            2: {
                trajectory: (bullet, delta) => { bullet.x += bullet.vx; bullet.y += bullet.vy + Math.sin(bullet.age / 10) * 5; }, // синусоида
                color: 0x0000ff, // синий (вода)
                size: 1.5,
                lifetime: 1500 // 1.5 секунды
            },
            3: {
                trajectory: (bullet, delta) => { bullet.x += bullet.vx * Math.cos(bullet.age / 10); bullet.y += bullet.vy * Math.sin(bullet.age / 10); }, // спираль
                color: 0x00ff00, // зеленый (земля)
                size: 0.5,
                lifetime: 2000 // 2 секунды
            },
            4: {
                trajectory: (bullet, delta) => { 
                    bullet.age += delta;
                    bullet.x += bullet.vx * Math.cos(bullet.age / 10); 
                    bullet.y += bullet.vy * Math.sin(bullet.age / 10); }, // спираль
                color: 0x00ff00, // зеленый (земля)
                size: 0.5,
                lifetime: 2000 // 2 секунды
            },
            // другие режимы...
        };

        // Текущий режим
        let mode = 1;

        // Обновление активного режима при нажатии клавиш 1-0
        window.addEventListener('keydown', (e) => {
            if (e.code >= 'Digit1' && e.code <= 'Digit9') {
                mode = parseInt(e.code[5]);
                updateActiveSlot();
            } else if (e.code === 'Digit0') {
                mode = 10;
                updateActiveSlot();
            }
        });

        // Обновление активного слота
        function updateActiveSlot() {
            const slots = document.querySelectorAll('.slot');
            slots.forEach(slot => slot.classList.remove('active'));
            const activeSlot = document.querySelector(`.slot[data-key="${mode}"]`);
            if (activeSlot) {
                activeSlot.classList.add('active');
            }
        }

        // Функция стрельбы
        function fireBullet() {
            const bullet = new PIXI.Sprite(bulletTexture);
            bullet.anchor.set(0.5);
            bullet.x = player.x;
            bullet.y = player.y;

            // Рассчитать направление пули
            const mousePosition = app.renderer.events.pointer.global;
            const angle = Math.atan2(mousePosition.y - player.y, mousePosition.x - player.x);
            bullet.vx = Math.cos(angle) * 10;
            bullet.vy = Math.sin(angle) * 10;

            // Применение свойств режима
            const modeProps = bulletModes[mode];
            bullet.tint = modeProps.color;
            bullet.scale.set(modeProps.size);
            bullet.lifetime = modeProps.lifetime;
            bullet.age = 0;

            bullet.update = function(delta) {
                modeProps.trajectory(this, delta);
                this.age += delta;
                if (this.age > this.lifetime) {
                    app.stage.removeChild(this);
                    bullets.splice(bullets.indexOf(this), 1);
                }
            };

            bullets.push(bullet);
            app.stage.addChild(bullet);
        }

        // Главный цикл игры
        app.ticker.add((delta) => {
            if (isPaused) return;

            // Обновление позиции игрока
            if (keys['KeyW']) player.y -= 5;
            if (keys['KeyA']) player.x -= 5;
            if (keys['KeyS']) player.y += 5;
            if (keys['KeyD']) player.x += 5;

            // Обновление пуль
            for (let bullet of bullets) {
                bullet.update(delta);
            }

            // Удаление пуль за пределами экрана
            for (let i = bullets.length - 1; i >= 0; i--) {
                const bullet = bullets[i];
                if (bullet.x < 0 || bullet.x > app.view.width || bullet.y < 0 || bullet.y > app.view.height) {
                    app.stage.removeChild(bullet);
                    bullets.splice(i, 1);
                }
            }
        });

        // Переключение режимов
        window.addEventListener('keydown', (e) => {
            if (e.code >= 'Digit1' && e.code <= 'Digit9') {
                mode = parseInt(e.code[5]);
            } else if (e.code === 'Digit0') {
                mode = 10;
            }
        });

        // Обработчики меню
        document.getElementById('resume').addEventListener('click', () => {
            isPaused = false;
            document.getElementById('menu').style.display = 'none';
        });

        document.getElementById('scrollsMaker').addEventListener('click', () => {
            isPaused = true;
            document.getElementById('menu').style.display = 'none';
            showScrollsMaker();
        });

        document.getElementById('restart').addEventListener('click', () => {
            location.reload();
        });

        // Панель слотов
        const slotPanel = document.getElementById('slot-panel');

        // Пауза и меню
        let isPaused = false;

        // Флаг для автоматической стрельбы
        let autoFire = false;
        let autoFireInterval;

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                autoFire = !autoFire;
                if (autoFire) {
                    startAutoFire();
                } else {
                    stopAutoFire();
                }
            } else if (e.code === 'Escape') {
                isPaused = !isPaused;
                document.getElementById('menu').style.display = isPaused ? 'block' : 'none';
            }
        });

        // Функция начала автоматической стрельбы
        function startAutoFire() {
            autoFireInterval = setInterval(() => {
                fireBullet();
            }, 100); // Скорость автоматической стрельбы
        }

        // Функция остановки автоматической стрельбы
        function stopAutoFire() {
            clearInterval(autoFireInterval);
        }

        // Начальная настройка активного слота
        updateActiveSlot();