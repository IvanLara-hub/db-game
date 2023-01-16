class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.player = new Player(this.ctx, 30, 270);
    this.bg = new Background(this.ctx, "./images/namek-1.jpg", 1);
    this.trees = new Background(this.ctx, "./images/trees.png", 2);
    this.win = new Image();
    this.win.src = "./images/youwin.webp";

    this.finish = new Image();
    this.finish.src = "./images/fin.webp";

    this.lifes = [
      new Life(this.ctx, 20),
      new Life(this.ctx, 60),
      new Life(this.ctx, 100),
    ];
    this.items = [];
    this.floor = new Floor(this.ctx);
    this.enemies = [];
    this.score = 0;
    this.tick = 0;

    this.sound = new Audio();
    this.sound.src = "./sounds/battlesound1.mp3";
    this.sound.volume = 0.4;

    this.hurtSound = new Audio();
    this.hurtSound.src = "./sounds/hurtsound.mp3";
    this.hurtSound.volume = 0.4;

    this.drinkSound = new Audio();
    this.drinkSound.src = "./sounds/drinking.mp3";
    this.drinkSound.volume = 1;

    this.explosionSound = new Audio();
    this.explosionSound.src = "./sounds/kamepunch.mp3";
    this.explosionSound.volume = 0.5;

    this.finishSound = new Audio();
    this.finishSound.src = "./sounds/gameoversong1.mp3";
    this.finishSound.volume = 0.7;
  }

  start() {
    this.sound.play();
    this.intervalId = setInterval(() => {
      const randomItemNum = Math.floor(Math.random() * 500);
      if (randomItemNum === 99) {
      }
      this.clear();
      this.draw();
      this.move();
      this.checkCollisions();

      //  this.gameSound.volume = 0.1;
      //  this.gameSound.play();

      this.tick++;
      if (this.tick % 100 === 0) {
        this.addEnemy();
      }

      if (randomItemNum === 99) {
        this.addItem();
      }

      if (this.lifes <= 0) {
        this.gameOver();
      }

      if (this.score === 20) {
        this.youWin();
      }

      if (this.score === 10 && this.player.actualImageState !== 3) {
        if (!this.player.isJumping) {
          this.player.yThreshold = 190;
          this.player.y = this.ctx.canvas.height - this.player.yThreshold;
        } else {
          this.player.yThreshold = 190;
        }
        this.player.changeImageStatus(3);
        this.player.isPowering = true;
        this.player.super = true;
        this.score++;
      }
    }, 1000 / 60);
  }

  draw() {
    this.bg.draw();
    this.trees.draw();
    this.floor.draw();
    this.enemies.forEach((enemy) => {
      enemy.draw();
    });
    this.player.draw();
    this.drawScore();
    this.lifes.forEach((life) => {
      life.draw();
    });
    this.items.forEach((item) => {
      item.draw();
    });
  }

  move() {
    this.bg.move();
    this.trees.move();
    this.floor.move();
    this.player.move();
    this.enemies.forEach((enemy) => {
      enemy.move(this.bg.speed);
    });
    this.items.forEach((item) => {
      item.move(this.player.movements);
    });
  }

  addItem() {
    this.items.push(
      new Item(this.ctx, this.ctx.canvas.width, this.ctx.canvas.height - 87)
    );
  }

  addEnemy() {
    const enmHeight = Math.random() * 50 + 50;
    const randomy = Math.random() * (this.canvas.height - enmHeight - 57);
    this.enemies.push(
      new Enemy(this.ctx, this.ctx.canvas.width, randomy, enmHeight)
    );
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.enemies = this.enemies.filter((enemy) => !enemy.isDead);
    this.player.bullets = this.player.bullets.filter(
      (bullet) => bullet.isVisible
    );
    this.items = this.items.filter((item) => !item.isCatched);
  }

  checkCollisions() {
    this.player.bullets.some((bullet) => {
      return this.enemies.some((enemy) => {
        if (enemy.collideWith(bullet)) {
          this.explosionSound.play();
          enemy.isDead = true;
          bullet.isVisible = false;
          this.score++;
        }
      });
    });

    this.enemies.forEach((enemy) => {
      if (enemy.collideWith(this.player) && !this.player.invincible) {
        this.hurtSound.play();
        if (this.player.lifes > 1) {
          this.player.invincible = true;
          this.player.lifes--;
          this.lifes.pop();

          setTimeout(() => {
            this.player.invincible = false;
          }, 2000);
        } else {
          this.lifes.pop();
          this.gameOver();
        }
      }
    });

    this.items.forEach((item) => {
      if (item.collideWith(this.player)) {
        item.isCatched = true;
        this.drinkSound.play();
        if (this.lifes.length < 3) {
          this.player.lifes++;
          this.lifes.push(
            new Life(this.ctx, this.lifes[this.lifes.length - 1].x + 40)
          );
        }
      }
    });
  }

  drawScore() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "24px Verdana";
    this.ctx.fillText("SCORE: " + this.score, 20, 35);
  }

  onKeyDown(event) {
    this.player.onKeyDown(event);
    this.bg.onKeyEvent(event);
    this.trees.onKeyEvent(event);
    this.floor.onKeyEvent(event);
  }

  onKeyUp(event) {
    this.player.onKeyUp(event);
    this.bg.onKeyEvent(event);
    this.trees.onKeyEvent(event);
    this.floor.onKeyEvent(event);
  }

  youWin() {
    clearInterval(this.intervalId);

    this.ctx.drawImage(this.win, 0, 0, 1000, 500);
    this.sound.pause();
    this.finishSound.play();

    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "El planeta está a salvo de nuevo.",
      this.canvas.width / 2,
      this.canvas.height / 2
    );
  }

  gameOver() {
    clearInterval(this.intervalId);

    this.ctx.save();
    this.gameStarted = false;
    this.ctx.drawImage(this.finish, 0, 0, 1000, 500);

    this.sound.pause();
    this.finishSound.play();

    this.ctx.fillStyle = "rgba(50, 50, 50, 0.7)";

    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "GAME OVER: El planeta será destruido :P",
      this.canvas.width / 2,
      this.canvas.height / 2
    );
    this.ctx.restore();
  }
}
