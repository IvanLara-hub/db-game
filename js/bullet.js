class Bullet {
  constructor(ctx, x, y, size) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = 150;
    this.isVisible = true;
    this.img = new Image();
    this.img.src = "./images/Kame.png";
    this.isReady = false;
    this.img.onload = () => {
      this.height = this.img.height;
      this.isReady = true;
    };
    this.speed = 15;
  }

  draw() {
    if (this.x > this.ctx.canvas.width) {
      this.isVisible = false;
    }

    if (this.isReady) {
      this.ctx.drawImage(
        this.img,
        this.x,
        this.y,
        this.width,
        (this.width * this.img.height) / this.img.width
      );
    }
  }

  move() {
    this.x += this.speed;
  }
}
