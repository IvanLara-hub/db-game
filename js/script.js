const game = new Game("canvas-test");
const startBtn = document.getElementById("start-btn");

startBtn.addEventListener("click", () => {
  const introDiv = document.querySelector("#intro");
  introDiv.remove();
  game.start();
});

document.addEventListener("keydown", function (event) {
  game.onKeyDown(event);
});

document.addEventListener("keyup", function (event) {
  game.onKeyUp(event);
});
