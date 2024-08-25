import { Unit } from './unit.js';

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
    // другие режимы...
};

// Функция стрельбы
function fireBullet(app, player, mode) {
    const bullet = new PIXI.Sprite(PIXI.Texture.from('res/bullet.png'));
    bullet.anchor.set(0.5);
    bullet.x = player.sprite.x;
    bullet.y = player.sprite.y;

    // Рассчитать направление пули
    const mousePosition = app.renderer.events.pointer.global;
    const angle = Math.atan2(mousePosition.y - player.sprite.y, mousePosition.x - player.sprite.x);
    bullet.vx = Math.cos(angle) * 10;
    bullet.vy = Math.sin(angle) * 10;

    // Применение свойств режима
    const modeProps = bulletModes[mode];
    bullet.tint = modeProps.color;
    bullet.scale.set(modeProps.size);
    bullet.lifetime = modeProps.lifetime;
    bullet.age = 0;

    bullet.update = function (delta) {
        this.age += delta;
        if (this.age >= this.lifetime) {
            app.stage.removeChild(this);
            bullets.splice(bullets.indexOf(this), 1);
            return;
        }
        modeProps.trajectory(this, delta);
    };

    bullets.push(bullet);
    app.stage.addChild(bullet);
}

// Функция обновления пуль
function updateBullets(delta) {
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
}

export { fireBullet, updateBullets, bulletModes };
