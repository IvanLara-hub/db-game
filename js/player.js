class Player {
  constructor(ctx, x, y) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.yThreshold = 150;
    this.lifes = 3;
    this.super = false;
    this.width = 150;
    this.bullets = [];
    this.invincible = false;
    this.kameSound = new Audio();
    this.kameSound.src = "./sounds/kame1.mp3";
    this.kameSound.volume = 0.7;

    this.transformation = new Audio();
    this.transformation.src = "./sounds/transformationsound.mp3";
    this.transformation.volume = 1;

    this.vy = 0;
    this.vx = 0;
    this.isShooting = false;
    this.actualImageState = 0;

    this.movements = {
      right: false,
      left: false,
    };

    this.gravity = 0.1;
    this.img = new Image();
    this.imagesSources = [
      {
        src: "./images/gokurun1.png",
        super: "./images/gokurun2.png",
        hFrames: 3,
        vFrames: 1,
        xFrame: 1,
        yFrame: 0,
      },
      {
        src: "./images/shoot1.png",
        super: "./images/shoot2.png",
        hFrames: 7,
        vFrames: 1,
        xFrame: 0,
        yFrame: 0,
      },
      {
        src: "./images/flying1.png",
        super: "./images/flying2.png",
        hFrames: 1,
        vFrames: 1,
        xFrame: 0,
        yFrame: 0,
      },
      {
        src: "./images/gokupower1.png",
        super: "./images/gokupower1.png",
        hFrames: 8,
        vFrames: 1,
        xFrame: 0,
        yFrame: 0,
      },
    ];
    this.img.src = this.imagesSources[0].src;
    this.isReady = false;
    this.img.onload = () => {
      this.isReady = true;
      this.height =
        (this.width * this.img.height) /
        (this.img.width / this.horizontalFrames);
    };

    this.isMoving = false;
    this.isJumping = false;
    this.horizontalFrames = this.imagesSources[0].hFrames;
    this.verticalFrames = this.imagesSources[0].vFrames;
    this.xFrame = this.imagesSources[0].xFrame;
    this.yFrame = this.imagesSources[0].yFrame;

    this.tick = 0;
  }

  draw() {
    if (this.isReady) {
      this.ctx.drawImage(
        this.img,
        (this.img.width / this.horizontalFrames) * this.xFrame,
        (this.img.height / this.verticalFrames) * this.yFrame,
        this.img.width / this.horizontalFrames,
        this.img.height / this.verticalFrames,
        this.x,
        this.y,
        this.width,
        this.height
      );

      this.bullets.forEach((bullet) => bullet.draw());
      this.tick++;
    }
  }

  move() {
    if (!this.isPowering) {
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;

      if (!this.isJumping && !this.isShooting) {
        if (this.actualImageState !== 0) {
          this.changeImageStatus(0);
        }

        if (this.movements.right && !this.movements.left) {
          this.xFrame = 2;
          this.isMoving = true;
        } else if (this.movements.left && !this.movements.right) {
          this.xFrame = 0;
          this.isMoving = true;
        } else {
          this.xFrame = 1;
          this.isMoving = false;
        }
      }

      if (!this.isShooting && !this.isJumping) {
        this.isJumping = false;
      }

      if (this.isJumping && !this.isShooting) {
        this.yFrame = 0;
        this.xFrame = 0;
      }

      if (this.y > this.ctx.canvas.height - this.yThreshold) {
        this.isJumping = false;
        this.y = this.ctx.canvas.height - this.yThreshold;
      }

      if (this.isShooting) {
        if (this.tick % 5 === 0) {
          if (this.xFrame === 6) {
            this.isShooting = false;
            this.bullets.push(
              new Bullet(this.ctx, this.x + 80, this.y + 20, 30)
            );
            if (this.isJumping) {
              this.changeImageStatus(2);
            } else {
              this.changeImageStatus(0);
            }
          } else {
            if (this.actualImageState !== 0) {
              this.xFrame++;
            }
          }
        }
      }

      this.bullets.forEach((bullet) => bullet.move());
    } else {
      if (this.tick % 28 === 0) {
        this.xFrame++;
        this.transformation.play();
        if (this.xFrame === 8) {
          this.isPowering = false;
          this.yThreshold = 150;
          if (this.isJumping) {
            this.changeImageStatus(2);
          } else {
            this.changeImageStatus(0);
          }
        }
      }
    }
  }

  onKeyDown(event) {
    if (event.keyCode === 38 && !this.isShooting && !this.isPowering) {
      // cuando pulso arriba
      this.changeImageStatus(2);
      this.isJumping = true;
      this.vy = -5;
    }

    if (event.keyCode === 37) {
      // cuando pulse izquierda aumento vx
      this.movements.left = true;
      this.isMoving = true;
    }

    if (event.keyCode === 39) {
      // cuando pulse derecha aumento vx

      this.movements.right = true;
      this.isMoving = true;
    }

    if (event.keyCode === 32 && !this.isShooting && !this.isPowering) {
      event.preventDefault();

      this.isShooting = true;
      this.changeImageStatus(1);
      this.kameSound.play();
    }
  }

  changeImageStatus(status) {
    this.actualImageState = status;
    this.img.src = this.super
      ? this.imagesSources[status].super
      : this.imagesSources[status].src;
    this.horizontalFrames = this.imagesSources[status].hFrames;
    this.verticalFrames = this.imagesSources[status].vFrames;
    this.xFrame = this.imagesSources[status].xFrame;
    this.yFrame = this.imagesSources[status].yFrame;

    if (status === 1) {
      this.width = 115;
    } else if (status === 0) {
      this.width = 150;
    } else if (status === 2) {
      this.width = 120;
    } else if (status === 3) {
      this.width = 120;
    }
  }

  onKeyUp(event) {
    if (event.keyCode === 37) {
      this.movements.left = false;
    }

    if (event.keyCode === 39) {
      this.movements.right = false;
    }

    if (event.keyCode === 37 || event.keyCode === 39) {
      this.isMoving = false;
    }
    if (event.keyCode === 38) {
      this.vy = 0;
    }
  }
}
