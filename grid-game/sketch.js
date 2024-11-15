// Grid Based Game
// Michael Yang
// 2024-11-15
// Extra for Experts:
// Used p5party for multiplayer

let gameState = ""; // Game state: "noLobby", "inGame", "winner", and "draw"
let firstLoadIn = true; // Flag to check if it is the first time you loaded into the room
let room; // Room code to join or create a party
let shared; // Shared data between players for synchronization
let gridBoard; // Local grid for the game
let circleSize; // Size of each piece (circle) in the grid
let sounds = {}; // Store all sound effects
let winnerColor = "";  // Track the winning color
const GRIDX = 7; // Number of columns in the grid
const GRIDY = 6; // Number of rows in the grid

function preload() {
  // Prompt user for room code
  room = prompt("Enter room code to create/join a party");

  // Connect to the p5.party server and the specific room
  partyConnect("wss://demoserver.p5party.org", room);

  // Initialize shared grid and current turn
  shared = partyLoadShared("grid", {board: generateEmptyGrid(GRIDY, GRIDX),
    // true for player 1's turn (host), false for player 2's turn (guest)
    currentTurn: true,
    // true for reset needed, false for no reset needed
    reset: false
  });

  // Preloading sounds
  sounds.bgMusic = loadSound("bgmusic.mp3");
  sounds.pieceDrop = loadSound("piecedrop.mp3");
}

function setup() {
  // Create canvas
  createCanvas(windowWidth, windowHeight);

  // Set circle size based on the smaller dimension of the window
  circleSize = min(width * 0.8 / GRIDX, height * 0.8 / GRIDY);

  // Create an empty local grid
  gridBoard = generateEmptyGrid(GRIDY, GRIDX);

  // Start background music
  sounds.bgMusic.loop(0, 1, 1, 0.5);
  sounds.bgMusic.amp(0.2);
}

// Window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Adjust circle size based on the resized window
  circleSize = min(width * 0.8 / GRIDX, height * 0.8 / GRIDY);
}

// Check if the user is in a room and update the game state accordingly
function checkIfInParty() {
  if (room) {
    gameState = "inGame";

  }
  else {
    gameState = "noLobby";
  }
}

// Handle different game states
function callGameStates() {
  // Show message if no room code is entered
  if (gameState === "noLobby") {
    noLobby();
  }
  else if (gameState === "inGame") {
    if (shared.board) { 
      // Display the shared game board
      displaySharedGrid();
      // Shows turn indicator 
      displayTurnCircle();
    }
    // Check for a winner
    determineIfWinner();
  }
  // Show winner screen
  else if (gameState === "winner") {
    winnerScreen();
  }
  else if (gameState === "draw") {
    drawScreen();
  }
}

// If no code is typed in during prompt
function noLobby() {
  background("red");
  textAlign(CENTER, CENTER);
  textSize(100);
  fill("black");
  text("Please refresh and type in a code!", width / 2, height / 2);
}

// Creates an empty grid that is 7 by 6
function generateEmptyGrid(rows, cols) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      newGrid[y].push(0);
    }
  }
  return newGrid;
}

// Display the grid for all players
function displaySharedGrid() {
  if (!shared.board) {
    return;
  }

  background("black");

  // Calculate offset to center the grid, in case of resizing
  let offsetX = (width - GRIDX * circleSize) / 2;
  let offsetY = (height - GRIDY * circleSize) / 2;

  // Center the grid
  translate(offsetX, offsetY);

  // Display the pieces on the grid
  displayColorsOfPieces();
}

// Give each ellipse its proper colors
function displayColorsOfPieces() {
  for (let y = 0; y < GRIDY; y++) {
    for (let x = 0; x < GRIDX; x++) {
      if (shared.board[y][x] === 2) {
        // Player 2 is yellow
        fill("yellow");
      } 
      else if (shared.board[y][x] === 1) {
        // Player 1 is red
        fill("red");
      } 
      else {
        // Empty cells are white
        fill("white");
      }
      ellipse(circleSize * x + circleSize / 2, circleSize * y + circleSize / 2, circleSize);
    }
  }
}

// Display a circle indicating which player's turn it is
function displayTurnCircle() {
  let turnColor = shared.currentTurn ? "red" : "yellow";
  fill(turnColor);
  noStroke();

  // Draw circle
  let turnCircleSize = circleSize * 0.8; 
  ellipse(width * 0.65, height * 0.1, turnCircleSize);
}

// Placing pieces
function mousePressed() {
  // Only allows clicking if gameState is inGame
  if (gameState === "inGame") {
    // Adjust mouse position to account for the grid's centering
    let offsetX = (width - GRIDX * circleSize) / 2;
    let offsetY = (height - GRIDY * circleSize) / 2;
  
    // Calculate the clicked column and row based on mouse position
    let cordX = Math.floor((mouseX - offsetX) / circleSize);
    let cordY = Math.floor((mouseY - offsetY) / circleSize);
    
    // Make sure you are clicking onto the actual board
    if (cordX >= 0 && cordY >= 0 && cordX < GRIDX && cordY < GRIDY) {
      // Prevent placing a piece in a full column
      if (gridBoard[0][cordX] !== 0) {
        return; 
      }
  
      // Host (Player 1) can only place a piece if it's their turn
      if (partyIsHost() && shared.currentTurn) {
      // Host color is red (1)
        placePiece(cordX, 1);
        // Switch to guest's turn
        shared.currentTurn = false;
      }
      // Guest (Player 2) can only place a piece if it's their turn
      else if (!partyIsHost() && !shared.currentTurn) {
      // Guest color is yellow (2)
        placePiece(cordX, 2);
        // Switch to host's turn
        shared.currentTurn = true;
      }
  
      // Sync the local grid with the shared grid
      partySetShared(shared, { board: gridBoard, currentTurn: shared.currentTurn });
    }
  }
}

// Place piece on grid
function placePiece(cordX, playerColor) {
  sounds.pieceDrop.play();
  // Place the piece in the lowest available row in the specified column
  for (let i = GRIDY - 1; i >= 0; i--) {
    if (gridBoard[i][cordX] === 0) {
      // Set piece for the player
      gridBoard[i][cordX] = playerColor; 
      // Exit after placing a piece
      break;
    }
  }
}

// Checks if anyone won horizontally
function horizontalWin() {
  for (let y = 0; y < GRIDY; y++) {
    // Variable to track previous color value
    let previousColorValue = 0;  
    // Variable to track how many pieces in a row
    let horizontalTally = 0;  

    // Loop from left to right of the row
    for (let x = 0; x < GRIDX; x++) {
      // Finds current color value
      let currentColorValue = gridBoard[y][x];

      // If the current piece is the same as the previous piece and not empty (0)
      if (currentColorValue === previousColorValue && currentColorValue !== 0) {
        horizontalTally += 1;
      } 
      // Reset tally if the piece is different
      else {
        horizontalTally = 1;  
      }

      // If the tally reaches 4, we have a winner
      if (horizontalTally >= 4) {
        // Set winnerColor
        winnerColor = currentColorValue; 
        return true;
      }

      // Update previousColorValue
      previousColorValue = currentColorValue;  
    }
  }
  // No winner
  return false; 
}

// Checks if anyone won vertically
function verticalWin() {
  for (let x = 0; x < GRIDX; x++) { 
    // Variable to track previous color value
    let previousColorValue = 0;  
    // Variable to track how many pieces in a row
    let verticalTally = 0;  

    // Loop from top to bottom of the column
    for (let y = 0; y < GRIDY; y++) { 
      // Finds current color value
      let currentColorValue = gridBoard[y][x];

      // If the current piece is the same as the previous piece and not empty (0)
      if (currentColorValue === previousColorValue && currentColorValue !== 0) {
        verticalTally += 1;
      } 
      // Reset tally if the piece is different
      else {
        verticalTally = 1;  
      }

      // If the tally reaches 4, we have a winner
      if (verticalTally >= 4) {
        // Set winnerColor to current color
        winnerColor = currentColorValue; 
        return true;
      }

      // Update previousColorValue
      previousColorValue = currentColorValue;  
    }
  }
  // No winner
  return false; 
}

// Checks if anyone won diagonally with a positive slope
function positiveSlopeWin() {
  // Start from row 3 (bottom-most possible for a diagonal)
  for (let y = GRIDY - 1; y >= 3; y--) { 
    // Stop at the last possible column for a diagonal
    for (let x = 0; x < GRIDX - 3; x++) { 

      // Finds current color value
      let currentColorValue = gridBoard[y][x];
      
      // Check if the current piece and the next three diagonal pieces are the same and not empty (0)
      if (currentColorValue !== 0 &&
          currentColorValue === gridBoard[y - 1][x + 1] &&
          currentColorValue === gridBoard[y - 2][x + 2] &&
          currentColorValue === gridBoard[y - 3][x + 3]) {
        // Set winnerColor to current color
        winnerColor = currentColorValue; 
        return true; 
      }
    }
  }
  // No winner
  return false; 
}

// Checks if anyone won diagonally with a negative slope
function negativeSlopeWin() {
  // Start from row 0 (top-most possible for a diagonal)
  for (let y = 0; y < GRIDY - 3; y++) { 
    // Stop at the last possible column for a diagonal
    for (let x = 0; x < GRIDX - 3; x++) { 

      // Finds current color value
      let currentColorValue = gridBoard[y][x];
      
      // Check if the current piece and the next three diagonal pieces are the same and not empty (0)
      if (currentColorValue !== 0 &&
          currentColorValue === gridBoard[y + 1][x + 1] &&
          currentColorValue === gridBoard[y + 2][x + 2] &&
          currentColorValue === gridBoard[y + 3][x + 3]) {
        // Set winnerColor to current color
        winnerColor = currentColorValue; 
        return true; 
      }
    }
  }
  // No winner
  return false;
}

// Check if there are no winners
function checkForDraw() {
  for (let x = 0; x < GRIDX; x++) {
    if (gridBoard[0][x] === 0) {
      return false;
    }
  }
  // Grid is full
  return true; 
}

// Determine if there is a winner by checking for horizontal, vertical, or diagonal wins
function determineIfWinner() {
  if (horizontalWin() || verticalWin() || positiveSlopeWin() || negativeSlopeWin()) {
  // If there is a winner, change the game state 
    gameState = "winner";
  }
  else if (checkForDraw()){
    gameState = "draw";
  }
}

// Display winner screen
function winnerScreen() {
  // Set the winner text
  let winnerText = `Winner: ${winnerColor === 1 ? "Red" : "Yellow"}`;
  
  // Add padding for the text
  let textWidthSize = textWidth(winnerText) + 20; 
  // Height of the rectangle
  let textHeightSize = 100;

  rectMode(CENTER);
  fill("black"); 
  noStroke(); 
  // Draw rectangle background behind the text
  rect(width / 2, height / 2, textWidthSize, textHeightSize); 

  textAlign(CENTER, CENTER);
  textSize(100);
  fill(winnerColor === 1 ? "red" : "yellow");
  // Draw text
  text(winnerText, width / 2, height / 2);
  fill("white");
  text("Press R to Reset", width * 0.25, height * 0.9);
}

// Display draw screen
function drawScreen() {
  // Set the draw text
  let drawText = "It's a Draw!";
  
  // Add padding for the text
  let textWidthSize = textWidth(drawText) + 20; 
  // Height of the rectangle
  let textHeightSize = 100;

  rectMode(CENTER);
  fill("black"); 
  noStroke(); 
  // Draw rectangle background behind the text
  rect(width / 2, height / 2, textWidthSize, textHeightSize); 

  textAlign(CENTER, CENTER);
  textSize(100);
  fill("white");
  // Draw text
  text(drawText, width / 2, height / 2);
  fill("white");
  text("Press R to Reset", width * 0.25, height * 0.9);
}

// If r is pressed reset game
function keyPressed() {
  if (key === "r" && gameState === "winner") {
    // Set the reset flag in the shared data
    partySetShared(shared, { reset: true });
  }
}

// Resets game completely
function resetGame() {
  // New empty grid
  gridBoard = generateEmptyGrid(GRIDY, GRIDX);

  // Make red (host) always go first
  shared.currentTurn = true;

  // Sync new information
  partySetShared(shared, { 
    board: gridBoard, 
    currentTurn: shared.currentTurn,
    reset: false
  });

  // Resetting Variables
  gameState = "inGame";
  winnerColor = "";
}

function draw() {
  // Sync the local grid with the shared grid for multiplayer functionality
  if (shared.board) {
    gridBoard = shared.board;
  }

  // Checks if reset has been called and if so reset the game for both users
  if (shared.reset) {
    resetGame();
  }

  // Party check is only checked once when first loading into the party
  if (firstLoadIn) {
    checkIfInParty();
    firstLoadIn = false;
  }

  // Calls functions depending on game state
  callGameStates();
}