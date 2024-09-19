// Interactive Scene
// Michael Yang
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


// 0 = Title Screen, 1 = Select Screen, 2 = Timing Game, 3 = Number Game.
let gameMode = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

// Changing gameMode
function mouseClicked() {
  // Title Screen to Game Mode Selection
  if (gameMode === 0) {
    gameMode += 1;
  }
  // Timing Game or Number Game
  else if (gameMode === 1) {
    if (
      mouseX > 0 &&
      mouseX < width / 2 &&
      mouseY > height / 3.5 &&
      mouseY < 2 * height
    ) {
      gameMode += 1;
    } else {
      if (
        mouseX > width / 2 &&
        mouseX < width + width / 2 &&
        mouseY > height / 3.5 &&
        mouseY < height / 3.5 + height
      ) {
        gameMode += 2;
      }
    }
  }
}

// Title Screen Function
function titleScreen() {
  background(51, 153, 255);

  // Title Text
  textSize(40);
  textFont("Verdana");
  text("Human Benchmark Ripoff", width / 2 - 240, height / 2 - 200);

  // Start Button Text
  textSize(30);
  text("Click to Start", width / 2 - 85, height / 2 + height / 5.5);

  // Call for gameStarted Function
  if (gameMode > 0) {
    gameStarted();
  }
}

// Game Started Function
function gameStarted() {
  background(51, 153, 255);

  // Title Text
  textSize(40);
  fill("black");
  text("Pick Game!", width / 2 - 125, height / 2 - 280);

  // Game Name Text
  textSize(30);
  text("Reaction Time", width / 2 - 300, height / 2 - 200);
  text("Number Memory", width / 2 + 50, height / 2 - 200);

  // Red Rectangle Timer Game
  fill("red");
  rect(0, height / 3.5, width / 2, height);

  // Blue Rectangle Number Game
  fill("blue");
  rect(width / 2, height / 3.5, width / 2, height);

  // Call for Timer Game
  if (gameMode > 1) {
    timerGame();
  }
  // Call for Number Game
  if (gameMode > 2) {
    numberGame();
  }
}

function timerGame() {
  background("red");
}

function numberGame() {
  background("blue");
}

function draw() {
  titleScreen();
}
