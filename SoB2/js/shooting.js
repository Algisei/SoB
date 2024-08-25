// shooting.js

export const bulletModes = {
    1: {
        trajectory: (bullet, delta) => { bullet.sprite.x += bullet.vx; bullet.sprite.y += bullet.vy; },
        color: 0xff0000, 
        size: 1,
        lifetime: 1000 
    },
    2: {
        trajectory: (bullet, delta) => { bullet.sprite.x += bullet.vx; bullet.sprite.y += bullet.vy + Math.sin(bullet.age / 10) * 5; },
        color: 0x0000ff, 
        size: 1.5,
        lifetime: 1500 
    },
    3: {
        trajectory: (bullet, delta) => { bullet.sprite.x += bullet.vx * Math.cos(bullet.age / 10); bullet.sprite.y += bullet.vy * Math.sin(bullet.age / 10); },
        color: 0x00ff00, 
        size: 0.5,
        lifetime: 2000 
    },
    4: {
        trajectory: (bullet, delta) => { 
            bullet.age += delta;
            bullet.sprite.x += bullet.vx * Math.cos(bullet.age / 10); 
            bullet.sprite.y += bullet.vy * Math.sin(bullet.age / 10); },
        color: 0x00ff00, 
        size: 0.5,
        lifetime: 2000 
    },
};

export class Bullet {
    constructor(texture, player, mode, modeProps, app) {
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.x = player.sprite.x;
        this.sprite.y = player.sprite.y;

        const mousePosition = app.renderer.events.pointer.global;
        const angle = Math.atan2(mousePosition.y - player.sprite.y, mousePosition.x - player.sprite.x);
        this.vx = Math.cos(angle) * 10;
        this.vy = Math.sin(angle) * 10;

        this.sprite.tint = modeProps.color;
        this.sprite.scale.set(modeProps.size);
        this.lifetime = modeProps.lifetime;
        this.age = 0;

        this.update = function(delta) {
            modeProps.trajectory(this, delta);
            this.age += delta;
            if (this.age > this.lifetime) {
                this.alive = false;
            }
        };
    }
}
