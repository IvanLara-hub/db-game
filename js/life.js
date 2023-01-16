class Life {
  constructor(ctx, x) {
    this.ctx = ctx;
    this.x = x;
    this.y = 50;
    this.width = 30;
    this.height = 30;
    this.img = new Image();
    this.img.src = "./images/life.png";
    this.isReady = false;
    this.img.onload = () => {
      this.isReady = true;
    };
  }

  draw() {
    if (this.isReady) {
      this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }
}
