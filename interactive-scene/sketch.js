// Interactive Scene
// Michael Yang
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// Variables
let gameState = "title";; // Possible states: "title", "select", "timerIns", "timer", "number"
let thunderImg;

//Canvas Setup
function setup() {
  createCanvas(windowWidth, windowHeight);
}

// Images
function preload() {
  thunderImg = loadImage("thunderbolt.png");
}

// Handle Window Resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); 
}

// Changing Screen/State
function mouseClicked() {
  // Title Screen to Game Mode Selection
  if (gameState === "title") {
    gameState = "select";
  }
  // Timing Game
  else if (gameState === "select") {
    if (mouseX > 0 && mouseX < width / 2 && mouseY > height / 3.5 && mouseY < 2 * height) {
      gameState = "timerIns"
      // Number Game
      } else {
      if (mouseX > width / 2 && mouseX < width + width / 2 && mouseY > height / 3.5 && mouseY < height / 3.5 + height) {
        gameState = "numberIns";
      }
    }
  } else if (gameState === "timerIns") {
    gameState = "timer"
  }
}

// Title Screen Function
function titleScreen() {
  background(51, 153, 255);

  // Title Text
  textSize(width * 0.05);
  fill("white");
  textFont("Verdana");
  let titleText = "Human Benchmark Ripoff";
  let titleX = width/2 - textWidth(titleText) / 2; // Center text horizontally
  text(titleText, titleX, height/2- height * 0.15); // Center text vertically

  // Start Button Text
  textSize(width * 0.03);
  let startText = "Click to Start";
  let startX = width / 2 - textWidth(startText) / 2; 
  text(startText, startX, height / 2 + height * 0.15); 
}

// Game Started Function
function gameStarted() {
  background(51, 153, 255);

  // Title Text
  textSize(width * 0.04);
  fill("white");
  let pickGameText = "Pick Game!";
  let pickGameX = width/2 - textWidth(pickGameText) / 2; 
  text(pickGameText, pickGameX, height / 2 - height * 0.35);

  // Game Name Text
  textSize(width * 0.02);
  let reactionTimeText = "Reaction Time";
  let numberMemoryText = "Number Memory";

  let reactionX = width / 2 - width * 0.32
  let numberX = width / 2 + width * 0.17

  text(reactionTimeText, reactionX, height/2 - height * 0.25);
  text(numberMemoryText, numberX, height/2 - height * 0.25);

  // Red Rectangle for Timer Game
  fill("red");
  rect(0, height / 3.5, width / 2, height);

  // Blue Rectangle for Number Game
  fill("blue");
  rect(width / 2, height / 3.5, width / 2, height);
}

function timerGameInstruction() {
  background(51, 153, 255);

  // Title Text
  textSize(height * 0.08); 
  fill("white");
  let timerText = "Reaction Time Test";
  let timerX = width / 2 - textWidth(timerText) / 2;
  text(timerText, timerX, height / 2 - height * 0.3); 
  image(thunderImg, width / 2 - thunderImg.width / 9, height / 2 - thunderImg.height / 7, thunderImg.width / 4, thunderImg.height / 4);

  // Instructions Text
  textSize(height * 0.04); // 4% of height
  let instructionText = "When the red screen turns green, click as quickly as you can.";
  let instructionX = width / 2 - textWidth(instructionText) / 2; 
  text(instructionText, instructionX, height / 2 + height * 0.2); 

  // Start Button Text
  textSize(height * 0.03); // 4% of height
  let startButtonText = "Click to Start";
  let startButtonX = width / 2 - textWidth(startButtonText) / 2; 
  text(startButtonText, startButtonX, height / 2 + height * 0.3);
}

function numberGameIns() {
  background("blue");
}

// Draw function to manage game screens
function draw() {
  if (gameState === "title") {
    titleScreen();
  } else if (gameState === "select") {
    gameStarted();
  } else if (gameState === "timerIns") {
    timerGameInstruction();
  }else if (gameState === "numberIns") {
    numberGameIns();
  }  
}