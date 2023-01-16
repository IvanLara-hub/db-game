class Enemy {
  constructor(ctx, x, y, height) {
    this.isDead = false;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.height = height;
    this.vx = -3;
    this.img = new Image();
    this.img.src = "./images/cell.png";
    this.isReady = false;
    this.img.onload = () => {
      this.width = this.height / 1.6;
      this.isReady = true;
    };
  }

  draw() {
    if (this.x + this.width < 0) {
      this.isDead = true;
    }

    if (this.isReady) {
      this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  move(playerSpeed) {
    if (this.isReady) {
      this.x += this.vx + playerSpeed;
    }
  }

  collideWith(obstacle) {
    return (
      this.x < obstacle.x + obstacle.width &&
      this.x + this.width > obstacle.x &&
      this.y < obstacle.y + obstacle.height &&
      this.y + this.height > obstacle.y
    );
  }
}
