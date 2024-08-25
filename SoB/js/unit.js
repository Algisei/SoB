class Unit {
    constructor(texture, x, y) {
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.x = x;
        this.sprite.y = y;
        this.vx = 0;
        this.vy = 0;
        this.speed = 5;
    }

    addToStage(stage) {
        stage.addChild(this.sprite);
    }

    removeFromStage(stage) {
        stage.removeChild(this.sprite);
    }

    setVelocity(vx, vy) {
        this.vx = vx;
        this.vy = vy;
    }

    update(delta) {
        this.sprite.x += this.vx * delta;
        this.sprite.y += this.vy * delta;
    }
}

// Экспорт класса Unit
export { Unit };
