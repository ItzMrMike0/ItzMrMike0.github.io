// Interactive Scene
// Michael Yang
// Date
// Extra for Experts:
// Made program scale if user resizes window.

// Variables.
let gameState = "title"; // Possible states: "title", "select", "timerIns", "timer", "red", "green" "numberins", "number".
let thunderImg;
let numberImg;
let startTime;
let waitTime;
let colorBackground = "red";
let greenShowUpTime;
let reactionTime;
let randomNumbers;
let userInput;

//Canvas setup.
function setup() {
  createCanvas(windowWidth, windowHeight);
  userInput = createInput("");
  userInput.position(100, 100);
}

// Images.
function preload() {
  thunderImg = loadImage("thunderbolt.png");
  numberImg = loadImage("numbers.png");
}

// Updates window resizing.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Changing state variable when mouse is clicked depending on the current state.
function mouseClicked() {
  // Title Screen to Game Mode Selection.
  if (gameState === "title") {
    gameState = "select";
  }
  // Game Mode Selection to Timing Game Instruction.
  else if (gameState === "select") {
    if (mouseY > height / 3.5) {
      if (mouseX < width / 2) {
        gameState = "timerIns";
      }
      // Game Mode Selection to Number Game Instruction.
      else {
        gameState = "numberIns";
      }
    }
  }
  // Timing Game Instruction to Timing Game.
  else if (gameState === "timerIns") {
    gameState = "timerG";
  }

  // Timing Game to Fail Screen.
  else if (gameState === "timerG") {
    if (colorBackground === "red") {
      gameState = "stillRed";
    }
    // Timing Game to Results Screen.
    else if (colorBackground === "green") {
      gameState = "notRed";
    }
  }
  // Fail Screen Back to Title Screen.
  else if (gameState === "stillRed") {
    gameState = "title";
  }

  // Reaction Time Results Screen to Title Screen.
  else if (gameState === "notRed") {
    gameState = "title";
  }

  // Number Game Instructions to Number Game.
  else if (gameState === "numberIns") {
    gameState = "numberG";
  }
}

// Function to draw centered text.
function drawCenteredText(textSentence, size, y, color = "white", font = "Verdana") {
  textSize(size);
  fill(color);
  textFont(font);
  let x = width / 2 - textWidth(textSentence) / 2;
  text(textSentence, x, y); 
}

// Function to draw non-centered text.
function drawOffCenteredText(textSentence, size, x, y, color = "white", font = "Verdana") {
  textSize(size);
  fill(color);
  textFont(font);
  text(textSentence, x, y); 
}

// Title Screen.
function titleScreen() {
  background(51, 153, 255);
  // Title text.
  drawCenteredText("Human Benchmark Ripoff", width * 0.05, height * 0.25);

  // Start button text.
  drawCenteredText("Click to Start", width * 0.03, height * 0.8);
}

// Game Started screen.
function gameStarted() {
  background(51, 153, 255);
  // Title text.
  drawCenteredText("Pick Game!", width * 0.04, height * 0.15);

  // Games' name text.
  drawOffCenteredText("Reaction Time", width * 0.02, width / 2 - width * 0.32 ,height * 0.25);
  drawOffCenteredText("Number Memory", width * 0.02, width / 2 + width * 0.17 ,height * 0.25); 

  // Red rectangle for reaction time
  fill("red");
  rect(0, height / 3.5, width / 2, height);

  // Blue Rectangle for number game.
  fill("blue");
  rect(width / 2, height / 3.5, width / 2, height);
}

// Timer Game Instructions page.
function timerGameInstruction() {
  background(51, 153, 255);

  // Title text.
  drawCenteredText("Reaction Time Test", width * 0.04, height * 0.2);

  // Instructions text.
  drawCenteredText("When the red screen turns green, click as quickly as you can.", width * 0.02, height * 0.7);

  // Start Button text.
  drawCenteredText("Click to Start", width * 0.015, height * 0.8);

  // Thunder image.
  let imgWidth = width * 0.15;
  let imgHeight = imgWidth * (thunderImg.height / thunderImg.width);
  image(thunderImg, width / 2 - imgWidth / 2, height * 0.3, imgWidth, imgHeight);
}

// Timing Game.
function timerGame() {
  // Setting up timers & resetting variables.
  if (startTime === undefined) {
    startTime = millis();
    waitTime = random(5000, 10000);
    reactionTime = undefined;
    greenShowUpTime = undefined;
  }

  timerGameBackground();
}

// Red-Green Background Change.
function timerGameBackground() {
  // Sets background to red.
  if (colorBackground === "red") {
    background("red");
    text(waitTime + startTime, width / 2, height / 2); // SHOWS TIME OF WHEN BG WILL CHANGE
  }
  // Once millis - startTime is greater than waitTime, the background will change to green.
  if (millis() - startTime > waitTime) {
    background("green");
    colorBackground = "green";
    // Stores time of when the screen changes to green.
    if (greenShowUpTime === undefined) {
      greenShowUpTime = millis();
    }
  }
}

// Fail Screen if the screen was clicked while it was still red.
function clickedTooEarly() {
  background("black");
  drawCenteredText(
    "You clicked too early! Try Again!",
    width * 0.03,
    height * 0.5
  );

  // Start Button text.
  drawCenteredText("Click to Reset", width * 0.015, height * 0.8);
  startTime = undefined;
}

// Results Screen if the screen was clicked once it was green.
function clickedOnGreen() {
  const REACTIONTIMEVALUE = Math.round(abs(greenShowUpTime - reactionTime));

  // Stores time of click.
  if (reactionTime === undefined) {
    reactionTime = millis();
  }
  background(51, 153, 255);

  // Title text.
  drawCenteredText(
    "The average reaction time is 273 milliseconds",
    width * 0.03,
    height * 0.1
  );

  // Results text.
  drawCenteredText(
    `Your reaction time is ${REACTIONTIMEVALUE} ms!`,
    width * 0.03,
    height * 0.5
  );

  // Tip/note text.
  drawCenteredText(
    "Using a fast computer and low latency / high framerate monitor will improve your score.",
    width * 0.02,
    height * 0.9
  );

  // Start Button text.
  drawCenteredText("Click to Reset", width * 0.015, height * 0.8);
  startTime = undefined;
  colorBackground = "red";
}

// Numbers Game Instruction Page.
function numberGameInstruction() {
  background(51, 153, 255);

  // Title text.
  drawCenteredText("Number Memorization Test", width * 0.04, height * 0.2);

  // Thunder image.
  let imgWidth = width * 0.15;
  let imgHeight = imgWidth * (thunderImg.height / thunderImg.width);
  image(numberImg, width / 2 - imgWidth / 2, height * 0.3, imgWidth, imgHeight);

  // Instructions text.
  drawCenteredText(
    "Remember the number shown on screen before the timer ends, and type it out.",
    width * 0.02,
    height * 0.7
  );

  // Start Button text.
  drawCenteredText("Click to Start", width * 0.015, height * 0.8);
}

function numberGame() {
  background(51, 153, 255);

  // Variables for how long the number should be on 
  if (startTime === undefined) {
    startTime = millis();
    waitTime = 3000;
  }

  // Sets a number with X amount of digits.
  if (randomNumbers === undefined) {
    randomNumbers = Math.floor(random(0, 10));
  }
  // Numbers Text
  drawCenteredText(randomNumbers, width * 0.04, height * 0.5);

  if (millis() - startTime > waitTime) {
    background(51, 153,255);
  }
  keyTyped();
}

function keyTyped() {
  let userInputNumber = userInput.value();
  if (keyCode === 13) {
    if (userInputNumber === randomNumbers) {
      background("green");
    }
  }
}

// Updates what function is being ran based off of state variable.
function changeScreenState() {
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
}

// First Call.
function draw() {
  changeScreenState();
  text(gameState, width - width + 100, height / 5); // GAME STATE CHECKER
  text(millis(), width - width + 200, height / 5); // TIME CHECKER
}

