// player.js

export class Player {
    constructor(texture, x, y, app) {
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.x = x;
        this.sprite.y = y;
        this.app = app;
        this.keys = {};

        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);
    }

    update() {
        if (this.keys['KeyW']) this.sprite.y -= 5;
        if (this.keys['KeyA']) this.sprite.x -= 5;
        if (this.keys['KeyS']) this.sprite.y += 5;
        if (this.keys['KeyD']) this.sprite.x += 5;
    }
}
