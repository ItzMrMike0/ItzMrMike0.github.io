// Interactive Scene
// Michael Yang
// Date
// Extra for Experts:
// Made program scale if user resizes window.

// Variables
let gameState = "title"; // Possible states: "title", "select", "timerIns", "timer", "numberins", "number"
let thunderImg;

//Canvas Setup
function setup() {
  createCanvas(windowWidth, windowHeight);
}

// Images
function preload() {
  thunderImg = loadImage("thunderbolt.png");
  numberImg = loadImage("numbers.png")
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
  else if (gameState === "numberIns") {
    gameState = "number"
  }
}

// Function to Draw Centered Text
function drawCenteredText(textSentence, size, y, color = "white", font = "Verdana") {
  textSize(size);
  fill(color);
  textFont(font);
  let x = width / 2 - textWidth(textSentence) / 2;
  text(textSentence, x, y); 
}

// Function to Draw Offcentered Text
function drawOffCenteredText(textSentence, size, x, y, color = "white", font = "Verdana") {
  textSize(size);
  fill(color);
  textFont(font);
  text(textSentence, x, y); 
}

// Title Screen Function
function titleScreen() {
  background(51, 153, 255);
  // Title Text
  drawCenteredText("Human Benchmark Ripoff", width * 0.05, height *0.25);

  // Start Button Text
  drawCenteredText("Click to Start", width * 0.03, height * 0.8)
}

// Game Started Function
function gameStarted() {
  background(51, 153, 255);
  // Title Text
  drawCenteredText("Pick Game!", width * 0.04, height * 0.15);

  // Game Name Text
  drawOffCenteredText("Reaction Time", width * 0.02, width / 2 - width * 0.32 ,height * 0.25);
  drawOffCenteredText("Number Memory", width * 0.02, width / 2 + width * 0.17 ,height * 0.25); 

  // Red Rectangle for Timer Game
  fill("red");
  rect(0, height / 3.5, width / 2, height);

  // Blue Rectangle for Number Game
  fill("blue");
  rect(width / 2, height / 3.5, width / 2, height);
}

// Timer Game Instructions Page
function timerGameInstruction() {
  background(51, 153, 255);

  // Title Text
  drawCenteredText("Reaction Time Test", width * 0.04, height * 0.2); 

  // Thunder Image
  let imgWidth = width * 0.15;
  let imgHeight = imgWidth * (thunderImg.height / thunderImg.width);
  image(thunderImg, width / 2 - imgWidth / 2, height * 0.3, imgWidth, imgHeight);

  // Instructions Text
  drawCenteredText("When the red screen turns green, click as quickly as you can.", width * 0.02, height * 0.7);

  // Start Button Text
  drawCenteredText("Click to Start", width* 0.015, height * 0.8);
}

// Numbers Game Instruction Page
function numberGameInstruction() {
  background(51, 153, 255);

   // Title Text
   drawCenteredText("Number Memorization Test", width * 0.04, height * 0.2); 

   // Thunder Image
   let imgWidth = width * 0.15;
   let imgHeight = imgWidth * (thunderImg.height / thunderImg.width);
   image(numberImg, width / 2 - imgWidth / 2, height * 0.3, imgWidth, imgHeight);
 
   // Instructions Text
   drawCenteredText("Remember the number shown on screen before the timer ends, and type it out.", width * 0.02, height * 0.7);
 
   // Start Button Text
   drawCenteredText("Click to Start", width* 0.015, height * 0.8); 
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
    numberGameInstruction();
  }
}