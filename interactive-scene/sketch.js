// Interactive Scene
// Michael Yang
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


// 0 = Title Screen, 1 = Select Screen, 2 = Timing Game Instructions, 3 = Number Game Instructions
let gameMode = 0;
let thunderImg;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function preload() {
  thunderImg = loadImage('thunderbolt.png');
}

// Changing gameMode
function mouseClicked() {
  // Title Screen to Game Mode Selection
  if (gameMode === 0) {
    gameMode += 1;
  }
  // Timing Game
  else if (gameMode === 1) {
    if (
      mouseX > 0 &&
      mouseX < width / 2 &&
      mouseY > height / 3.5 &&
      mouseY < 2 * height
    ) {
      gameMode += 1;
      // Number Game
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
  else if (gameMode === 2) {
    gameMode += 1;
    }
}

// Title Screen Function
function titleScreen() {
  background(51, 153, 255);

  // Title Text
  textSize(80);
  fill("white")
  textFont("Verdana");
  text("Human Benchmark Ripoff", width / 2 - 500, height / 2 - 200);

  // Start Button Text
  textSize(30);
  text("Click to Start", width / 2 - 100, height / 2 + height / 5.5);
}

// Game Started Function
function gameStarted() {
  background(51, 153, 255);

  // Title Text
  textSize(60);
  fill("white");
  text("Pick Game!", width / 2 - 150, height / 2 - 280);

  // Game Name Text
  textSize(30);
  text("Reaction Time", width / 2 - width /3.25 , height / 2 - 200);
  text("Number Memory", width / 2 + width /5.7, height / 2 - 200);

  // Red Rectangle Timer Game
  fill("red");
  rect(0, height / 3.5, width / 2, height);

  // Blue Rectangle Number Game
  fill("blue");
  rect(width / 2, height / 3.5, width / 2, height);
}

function timerGame() {
  // Title Text
  background(51, 153, 255);
  textSize(60)
  fill("white")
  text("Reaction Time Test", width / 2 - 275, height / 2 - 200); 
  image(thunderImg, width/2- 100, height/2- 150, thunderImg.width/5, thunderImg.height/5);

  // Instructions Text
  textSize(30);
  text("When the red screen turns green, click as quickly as you can can.", width/2 - 480, height / 2 + height / 4);

  // Start Button Text
  textSize(30);
  text("Click to Start", width / 2 - 85, height / 2 + height / 3);
  
}

function numberGame() {
  background("blue");
}

function draw() {
  text(gameMode, 0, 300);
  titleScreen();

  // Call for gameStarted Function
  if (gameMode === 1) {
    gameStarted();
  }

  // Call for Timer Game
  if (gameMode === 2) {
    timerGame();
  }

  // Call for Number Game
  if (gameMode === 3) {
    numberGame();
  }

}