// Interactive Scene
// Michael Yang
// 10/1/2024
// Extra for Experts:
// Made program scale if user resizes window.

// Variables
let gameState = "title"; // Possible states: "title", "select", "timerIns", "timerG", "stillRed", "notRed", "numberIns", "numberG", "numberInput", "wrongNumber".
let thunderImg;
let numberImg;
let startTime = 0; // For tracking game start time
let waitTime = 0; // Random wait time before the game starts for both timer game and numbers game
let colorBackground = "red"; // Background color, initially set to red for reaction game
let greenShowUpTime = 0; // Tracks when the green screen appears
let reactionTime = 0; // Stores user reaction time
let randomNumbers = 0; // Stores the random number for the memory game
let digitCounter = 1; // Tracks how many digits user has to remember

//Canvas setup
function setup() {
  createCanvas(windowWidth, windowHeight); 
}

// Loads images
function preload() {
  thunderImg = loadImage("thunderbolt.png");
  numberImg = loadImage("numbers.png");
}

// Updates window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); 
}

// Changing state variable when mouse is clicked depending on the current state
function mouseClicked() {
  // Title Screen to Game Mode Selection
  if (gameState === "title") {
    gameState = "select";
  }
  // Game Mode Selection to Timing Game Instruction
  else if (gameState === "select") {
    if (mouseY <= height / 3.5) {
      return; 
    }

    if (mouseX < width / 2) {
      gameState = "timerIns";
    }
    // Game Mode Selection to Number Game Instruction
    else {
      gameState = "numberIns";
    }
  }
  // Timing Game Instruction to Timing Game
  else if (gameState === "timerIns") {
    gameState = "timerG";
  }
  // Timing Game to Fail Screen
  else if (gameState === "timerG") {
    if (colorBackground === "red") {
      gameState = "stillRed";
    }
    // Timing Game to Results Screen
    else if (colorBackground === "green") {
      gameState = "notRed";
    }
  }
  // Fail Screen Back to Title Screen
  else if (gameState === "stillRed") {
    gameState = "title";
  }

  // Reaction Time Results Screen to Title Screen
  else if (gameState === "notRed") {
    gameState = "title";
  }

  // Number Game Instructions to Number Game
  else if (gameState === "numberIns") {
    gameState = "numberG";
  }

  // Wrong Number Screen to Title Screen
  else if (gameState === "wrongNumber") {
    gameState = "title";
  }
}

// Function to draw text
function drawCenteredText(textSentence, size, x, y, centered, color = "white", font = "Verdana",) {
  textSize(size);
  fill(color);
  textFont(font);
  if (centered) {
    x = width / 2 - textWidth(textSentence) / 2;
  }
  text(textSentence, x, y); 
}

// Title Screen
function titleScreen() {
  background(51, 153, 255);
  drawCenteredText("Human Benchmark Ripoff", width * 0.05, 0, height * 0.25,  true);
  drawCenteredText("Click to Start", width * 0.03, 0, height * 0.8,  true);
}

// Game Started screen
function gameStarted() {
  background(51, 153, 255);
  drawCenteredText("Pick Game!", width * 0.04, 0, height * 0.15, true);

  // Game option text
  drawCenteredText("Reaction Time", width * 0.02, width / 2 - width * 0.32 ,height * 0.25, false);
  drawCenteredText("Number Memory", width * 0.02, width / 2 + width * 0.17 ,height * 0.25, false); 

  // Red rectangle for reaction time
  fill("red");
  rect(0, height / 3.5, width / 2, height);

  // Blue Rectangle for number game
  fill("blue");
  rect(width / 2, height / 3.5, width / 2, height);
}

// Timer Game Instructions page
function timerGameInstruction() {
  background(51, 153, 255);
  drawCenteredText("Reaction Time Test", width * 0.04, 0, height * 0.2, true);
  drawCenteredText("When the red screen turns green, click as quickly as you can.", width * 0.02, 0, height * 0.7, true);
  drawCenteredText("Click to Start", width * 0.015, 0, height * 0.8, true);

  // Thunder image
  let imgWidth = width * 0.15;
  let imgHeight = height * 0.25;
  image(thunderImg, width / 2 - imgWidth / 2, height * 0.3, imgWidth, imgHeight);
}

// Timing Game.
function timerGame() {
  // Setting up timers & resetting variables
  if (startTime === 0) {
    startTime = millis();
    waitTime = random(3000, 8000);
    reactionTime = 0;
    greenShowUpTime = 0; 
  }
  timerGameBackground();
}

// Background colour change for timing game
function timerGameBackground() {
  if (colorBackground === "red") {
    background("red");
  }

  // Once millis - startTime is greater than waitTime, the background will change to green
  if (millis() - startTime >= waitTime) {
    background("green");
    colorBackground = "green";
    // Stores time of when the screen changes to green
    if (greenShowUpTime === 0) {
      greenShowUpTime = millis();
    }
  }
}

// Fail Screen if the screen was clicked while it was still red
function clickedTooEarly() {
  background("black");
  drawCenteredText("You clicked too early! Try Again!", width * 0.03, 0, height * 0.5, true);
  drawCenteredText("Click to Reset", width * 0.015, 0, height * 0.8, true);
  // Reset timer
  startTime = 0; 
}

// Results Screen if the screen was clicked once it was green
function clickedOnGreen() {
  // Stores time of click
  if (reactionTime === 0) {
    reactionTime = millis();
  }
  
  // Calculate reaction time
  let reactionTimeValue = Math.round(abs(greenShowUpTime - reactionTime));

  background(51, 153, 255);
  drawCenteredText("The average reaction time is 273 milliseconds", width * 0.03, 0, height * 0.1, true);
  drawCenteredText(`Your reaction time is ${reactionTimeValue} ms!`, width * 0.03, 0, height * 0.5, true);
  drawCenteredText("Using a fast computer and low latency / high framerate monitor will improve your score.", width * 0.02, 0, height * 0.9, true);
  drawCenteredText("Click to Reset", width * 0.015, 0, height * 0.8, true);

  // Reseting timer and background colour
  startTime = 0;
  colorBackground = "red";
}

// Numbers Game Instruction Page
function numberGameInstruction() {
  background(51, 153, 255);
  drawCenteredText("Number Memorization Test", width * 0.04, 0, height * 0.2, true);
  drawCenteredText("Remember the number shown on screen before the timer ends, and type it out.", width * 0.02, 0, height * 0.7, true);
  drawCenteredText("Click to Start", width * 0.015, 0, height * 0.8, true);

  // Number image
  let imgWidth = width * 0.15;
  let imgHeight = height * 0.25;
  image(numberImg, width / 2 - imgWidth / 2, height * 0.3, imgWidth, imgHeight);
}

// Number Game
function numberGame() {
  background(51, 153, 255);

  // Variables for timing
  if (startTime === 0) {
    startTime = millis();
    // Calculate how long the number will display for
    waitTime = 1000 + digitCounter * 500;
  }

  // Generate a number with X amount of digits based on digitCounter
  if (randomNumbers === 0) {
    let minNumber = Math.pow(10, digitCounter - 1); 
    let maxNumber = Math.pow(10, digitCounter) - 1;  
    randomNumbers = Math.floor(random(minNumber, maxNumber + 1));  
  }

  // Display the random number
  drawCenteredText(randomNumbers, width * 0.04, 0, height * 0.5, true);

  // Calculate how much time has passed
  let timePassed = millis() - startTime;

  // Calculate the fraction of time left
  let timeLeftRatio = constrain((waitTime - timePassed) / waitTime, 0, 1);

  // Sets rectangle variable 
  let rectWidth = width * 0.6; 
  let rectHeight = height * 0.05;
  let filledArea = rectWidth * timeLeftRatio;

  // Draws white rectangle showing time left 
  fill(255);
  rect(width * 0.2, height * 0.9, filledArea, rectHeight);

  // Transition to the input phase after the waitTime
  if (millis() - startTime > waitTime) {
    background(51, 153, 255);
    gameState = "numberInput";
  }
}

function userInputScene() {
  // Ask for input from user 
  let userInputedNumber = Number(prompt("Enter the number that was on the screen."));

  // If user input is the same as the number shown on screen
  if (userInputedNumber === randomNumbers) {
    gameState = "numberG";

    // Sets variables 
    digitCounter += 1;
    startTime = 0;
    randomNumbers = 0;
  }
  // If the user input is not the same as the number shown on screen
  else {
    background(51, 153, 255);
    gameState = "wrongNumber";
    drawCenteredText("You put the wrong numbers in!", width * 0.03, 0, height * 0.1, true);
    drawCenteredText(`You can remember up to ${digitCounter - 1} digits at once!`, width* 0.03, 0, height * 0.5, true);
    drawCenteredText("Click to Reset", width * 0.015, 0, height * 0.8, true);
    drawCenteredText("The average person can remember 7 numbers at once. Can you do more?", width * 0.02, 0, height * 0.9, true);

    // Resets variables 
    digitCounter = 1;
    startTime = 0;
    randomNumbers = 0;
  }
}

// Changes what function is being ran based off of state variable.
function draw() {
  if (gameState === "title") {
    titleScreen();
  }
  else if (gameState === "select") {
    gameStarted();
  }
  else if (gameState === "timerIns") {
    timerGameInstruction();
  }
  else if (gameState === "numberIns") {
    numberGameInstruction();
  }
  else if (gameState === "timerG") {
    timerGame();
  }
  else if (gameState === "stillRed") {  
    clickedTooEarly();
  }
  else if (gameState === "notRed") {
    clickedOnGreen();
  }
  else if (gameState === "numberG") {
    numberGame();
  }
  else if (gameState === "numberInput") {
    userInputScene();
  }
}