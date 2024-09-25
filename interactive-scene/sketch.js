// Interactive Scene
// Michael Yang
// Date
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// Variables
let gameState = "title"; // Possible states: "title", "select", "timerIns", "timer", "number"
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
    if (mouseY > height / 3.5) {
      if (mouseX < width / 2) {
        gameState = "timerIns";
      } else {
        gameState = "numberIns";
      }
    }
  } else if (gameState === "timerIns") {
    gameState = "timer"
  }
}

// // Function to draw centered text
// function drawCenteredText(text, size, y, color, font = "Verdana") {
//   textSize(size);
//   fill(color);
//   textFont(font);
//   let x = width / 2 - textWidth(text) / 2;
//   text(text, x, y); 
// }

// Title Screen Function
function titleScreen() {
  background(51, 153, 255);

  // Title Text
  textSize(width * 0.05);
  fill("white");
  textFont("Verdana");
  let titleText = "Human Benchmark Ripoff";
  let titleX = width/2 - textWidth(titleText) / 2; // Center text horizontally
  text(titleText, titleX, height * 0.25); // Center text vertically

  // Start Button Text
  textSize(width * 0.03);
  let startText = "Click to Start";
  let startX = width / 2 - textWidth(startText) / 2; 
  text(startText, startX, height * 0.80); 
}

// Game Started Function
function gameStarted() {
  background(51, 153, 255);

  // Title Text
  textSize(width * 0.04);
  fill("white");
  let pickGameText = "Pick Game!";
  let pickGameX = width/2 - textWidth(pickGameText) / 2; 
  text(pickGameText, pickGameX, height * 0.15);

  // Game Name Text
  textSize(width * 0.02);
  let reactionTimeText = "Reaction Time";
  let numberMemoryText = "Number Memory";

  let reactionX = width / 2 - width * 0.32
  let numberX = width / 2 + width * 0.17

  text(reactionTimeText, reactionX, height * 0.25);
  text(numberMemoryText, numberX, height * 0.25);

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
  textSize(width * 0.04); 
  fill("white");
  let timerText = "Reaction Time Test";
  let timerX = width / 2 - textWidth(timerText) / 2;
  text(timerText, timerX, height * 0.2); 

  // Thunder Image
  let imgWidth = width * 0.15;
  let imgHeight = imgWidth * (thunderImg.height / thunderImg.width);
  image(thunderImg, width / 2 - imgWidth / 2, height * 0.3, imgWidth, imgHeight);

  // Instructions Text
  textSize(width * 0.02); 
  let instructionText = "When the red screen turns green, click as quickly as you can.";
  let instructionX = width / 2 - textWidth(instructionText) / 2; 
  text(instructionText, instructionX, height * 0.7); // Position below the image

  // Start Button Text
  textSize(width * 0.015);
  let startButtonText = "Click to Start";
  let startButtonX = width / 2 - textWidth(startButtonText) / 2; 
  text(startButtonText, startButtonX, height * 0.8); // Position at 75% of height
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