class Item {
  constructor(ctx, x, y) {
    this.isDead = false;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.height = 30;
    this.width = 30;
    this.vx = -3;
    this.isCatched = false;
    this.img = new Image();
    this.img.src = "./images/potion.png";
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

  move(playerMovements) {
    if (this.isReady) {
      if (playerMovements) {
        if (playerMovements.right) {
          this.x -= 5;
        }
        if (playerMovements.left) {
          this.x += 5;
        }
      }
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
