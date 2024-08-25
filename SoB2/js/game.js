// game.js

import { initializeSlotPanel, updateActiveSlot } from './gscrInterface.js';
import { initializeMenu, toggleMenu } from './menu.js';
import { Player } from './player.js';
import { Bullet, bulletModes } from './shooting.js';
import { showScrollsMaker } from './scrollsMaker.js'; // Оставляем только этот импорт


export function startGame() {
    // Проверка загрузки Pixi.js
    if (typeof PIXI === 'undefined') {
        console.error('Pixi.js не загружен');
        return;
    } else {
        console.log('Pixi.js загружен');
    }

    // Создание приложения PixiJS
    const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x1099bb,
    });

    document.body.appendChild(app.view);

    // Проверка добавления canvas
    if (!app.view) {
        console.error('Canvas не добавлен');
    }

    // Загрузка текстур
    const playerTexture = PIXI.Texture.from('res/player.png');
    const bulletTexture = PIXI.Texture.from('res/bullet.png');

    const player = new Player(playerTexture, app.view.width / 2, app.view.height / 2, app);
    const bullets = [];

    let mode = 1;
    let isPaused = false;
    let autoFire = false;
    let autoFireInterval;

    function fireBullet() {
        const bullet = new Bullet(bulletTexture, player, mode, bulletModes[mode], app);
        bullets.push(bullet);
        app.stage.addChild(bullet.sprite);
    }

    function startAutoFire() {
        autoFireInterval = setInterval(fireBullet, 100); // Скорость автоматической стрельбы
    }

    function stopAutoFire() {
        clearInterval(autoFireInterval);
    }

    window.addEventListener('keydown', (e) => {
        switch (e.code) {
            case 'KeyE':
                showScrollsMaker();
                break;
            case 'Space':
                autoFire = !autoFire;
                autoFire ? startAutoFire() : stopAutoFire();
                break;
            case 'Escape':
                isPaused = !isPaused;
                toggleMenu(isPaused);
                break;
            default:
                if (e.code >= 'Digit1' && e.code <= 'Digit9') {
                    mode = parseInt(e.code[5]);
                } else if (e.code === 'Digit0') {
                    mode = 10;
                }
                updateActiveSlot(mode);
                break;
        }
    });

    app.ticker.add((delta) => {
        if (isPaused) return;

        player.update(keys);

        bullets.forEach((bullet, index) => {
            bullet.update(delta);
            if (!bullet.alive) {
                app.stage.removeChild(bullet.sprite);
                bullets.splice(index, 1);
            }
        });
    });

    initializeSlotPanel();
    initializeMenu(showScrollsMaker, () => location.reload());
    updateActiveSlot();
}
