class Background {
  constructor(ctx, imgSrc, bgSpeed) {
    this.ctx = ctx;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.width = this.ctx.canvas.width;
    this.height = this.ctx.canvas.height;
    this.img = new Image();
    this.img.src = imgSrc;
    this.isReady = false;
    this.bgSpeed = bgSpeed
    this.img.onload = () => {
      this.isReady = true;
    };
    this.speed = 0;
    this.directions = {
      left: false,
      right: false,
    };
  }

  draw() {
    if (this.isReady) {
      this.ctx.drawImage(
        this.img,
        this.x - this.ctx.canvas.width,
        this.y,
        this.width,
        this.height
      );
      this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      this.ctx.drawImage(
        this.img,
        this.x + this.ctx.canvas.width,
        this.y,
        this.width,
        this.height
      );
    }
  }

  move() {
    this.x += this.speed;

    if (this.directions.left) {
      this.speed = this.bgSpeed;
    } else if (this.directions.right) {
      this.speed = -this.bgSpeed;
    } else {
      this.speed = 0;
    }

    if (
      this.x + this.ctx.canvas.width <= 0 ||
      this.x >= this.ctx.canvas.width
    ) {
      this.x = 0;
    }
  }

  onKeyEvent(event) {
    const isKeyDown = event.type === "keydown";

    if (event.keyCode === 37) {
      this.directions.left = isKeyDown;
    } else if (event.keyCode === 39) {
      this.directions.right = isKeyDown;
    }
  }
}
