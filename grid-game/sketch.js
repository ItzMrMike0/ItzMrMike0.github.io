// Grid Based Game
// Michael Yang
// 2024-11-07
// Extra for Experts:
// Used p5party for multiplayer

let gameState = ""; // noLobby, inGame
let room; // Variable to hold the room code
let shared; // Variable for shared data
let gridBoard; // Local grid for the game
let circleSize; // Variable for circle size
let playerTurn; // Player turn (true for player 1, false for player 2)
const GRIDX = 7; // Cols
const GRIDY = 6; // Rows

function preload() {
  // Prompt user for room code
  room = prompt("Enter room code to create/join a party");

  // Connect to the p5.party server and the specific room
  partyConnect("wss://demoserver.p5party.org", room);

  // Initialize shared grid and turn if not already initialized
  shared = partyLoadShared("grid", {board: generateEmptyGrid(GRIDY, GRIDX),
    // true for player 1's turn (host), false for player 2's turn (guest)
    currentTurn: true 
  });
}

function setup() {
  // Create canvas
  createCanvas(windowWidth, windowHeight);

  // Set circleSize based on the smaller dimension of the window
  circleSize = min(width * 0.8 / GRIDX, height * 0.8 / GRIDY);

  // Create an empty local grid
  gridBoard = generateEmptyGrid(GRIDY, GRIDX);
}

// Window scaling
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Limit the width of the grid to 80% of the screen width
  let maxGridWidth = width * 0.8;
  
  // Set circle size based on the smaller dimension (either width or height)
  circleSize = min(maxGridWidth / GRIDX, height / GRIDY);
}

// Creates an empty grid that is 7 by 6
function generateEmptyGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < cols; y++) {
    newGrid.push([]);
    for (let x = 0; x < rows; x++) {
      newGrid[y].push(0);
    }
  }
  return newGrid;
}

// Updates for the board display
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

  // Set colors for each piece
  for (let y = 0; y < GRIDY; y++) {
    for (let x = 0; x < GRIDX; x++) {
      if (shared.board[y][x] === 2) {
        fill("yellow");
      } 
      else if (shared.board[y][x] === 1) {
        fill("red");
      } 
      else {
        fill("white");
      }
      ellipse(circleSize * x + circleSize / 2, circleSize * y + circleSize / 2, circleSize);
    }
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

// Calls functions depending on gameState
function callGameStates() {
  if (gameState === "noLobby") {
    noLobby();
  }
  if (gameState === "inGame") {
    // Show the turn indicator as a circle
    if (room) {
      // Check if shared.board is defined
      if (shared.board) { 
        // Display the shared board for all players
        displaySharedGrid();
      }
    }
    displayTurnCircle();

  }
}

// If a room is created/joined, display the shared game. Otherwise, bring back to noLobby
function changeGameStates() {
  if (room) {
    gameState = "inGame";
  }
  else {
    gameState = "noLobby";
  }
}

// Placing pieces down
function mousePressed() {
  // Adjust mouseX to account for the translation (centering)
  let offsetX = (width - GRIDX * circleSize) / 2;
  let offsetY = (height - GRIDY * circleSize) / 2;

  // Calculate coordinates relative to the centered grid
  let cordX = Math.floor((mouseX - offsetX) / circleSize);
  let cordY = Math.floor((mouseY - offsetY) / circleSize);

  // Make sure the click is within the grid bounds
  if (cordX >= 0 && cordX < GRIDX && cordY >= 0 && cordY < GRIDY) {
    // Check if the column is full (if the top row is filled)
    if (gridBoard[0][cordX] !== 0) {
      console.log("This column is full!");
      return; // Don't place a piece if the column is full
    }

    // Host (Player 1) can only place a piece if it's their turn
    if (partyIsHost() && shared.currentTurn) {
      // Host colour is red (1)
      placePiece(cordX, cordY, 1);
      // Switch to guest's turn
      shared.currentTurn = false;
    }
    // Guest (Player 2) can only place a piece if it's their turn
    else if (!partyIsHost() && !shared.currentTurn) {
      // Guest colour is yellow (2)
      placePiece(cordX, cordY, 2);
      // Switch to host's turn
      shared.currentTurn = true;
    }

    // Sync local grid with shared grid using partySetShared
    partySetShared(shared, { board: gridBoard, currentTurn: shared.currentTurn });
  }
}


// Place piece on grid
function placePiece(cordX, cordY, playerColor) {
  // Make sure cell you're toggling is in the grid
  if (cordX >= 0 && cordY >= 0 && cordX < GRIDX && cordY < GRIDY) {
    // Places piece at lowest possible cell
    for (let i = GRIDY - 1; i >= 0; i--) {
      if (gridBoard[i][cordX] === 0) {
        // Set piece for the player
        gridBoard[i][cordX] = playerColor; 
        // Break after each individual piece or whole col will be filled.
        break;
      }
    }
  }
}

// Circle showing which player's turn it is
function displayTurnCircle() {
  let turnColor = shared.currentTurn ? "red" : "yellow";
  fill(turnColor);
  noStroke();

  // Draw turn indicator circle at top center
  let turnCircleSize = circleSize * 0.8; 
  ellipse(width * 0.65, height * 0.1, turnCircleSize);
}

// Checks if anyone won horizontally
function horizontalWin() {
  for (let y = 0; y < GRIDY; y++) {
    // Reset previous color for each row
    let previousColorValue = 0;  
    // Reset tally for each row
    let horizontalTally = 0;  

    for (let x = 0; x < GRIDX; x++) {
      // Finds current color value
      let currentColorValue = gridBoard[y][x];

      // If the current piece is the same as the previous piece and not empty (0)
      if (currentColorValue === previousColorValue && currentColorValue !== 0) {
        horizontalTally += 1;
      } 
      // Start a new tally if the piece is different
      else {
        horizontalTally = 1;  
      }

      // If the tally reaches 4, we have a winner
      if (horizontalTally >= 4) {
        console.log(`Horizontal win at row ${y}!`);
        return true;
      }

      // Update previousColorValue
      previousColorValue = currentColorValue;  
    }
  }
  // No winner found horizontally
  return false; 
}

// Checks if anyone won vertically
function verticalWin() {
  for (let x = 0; x < GRIDX; x++) { // Loop through each column
    // Reset previous color for each column
    let previousColorValue = 0;  
    // Reset tally for each column
    let verticalTally = 0;  

    for (let y = 0; y < GRIDY; y++) { // Loop from top to bottom of the column
      let currentColorValue = gridBoard[y][x];

      // If the current piece is the same as the previous piece and not empty (0)
      if (currentColorValue === previousColorValue && currentColorValue !== 0) {
        verticalTally += 1;
      } 
      // Start a new tally if the piece is different
      else {
        verticalTally = 1;  
      }

      // If the tally reaches 4, we have a winner
      if (verticalTally >= 4) {
        console.log(`Vertical win at column ${x}!`);
        return true;
      }

      // Update previousColorValue
      previousColorValue = currentColorValue;  
    }
  }

  // No winner found vertically
  return false; 
}

// Checks if anyone won diagonally with a positive slope
function positiveSlopeWin() {
  // Start from row 3 (bottom-most possible for a diagonal)
  for (let y = GRIDY - 1; y >= 3; y--) { 
    // Stop at the last possible column for a diagonal
    for (let x = 0; x < GRIDX - 3; x++) { 
      let currentColorValue = gridBoard[y][x];
      
      // Check if the current piece and the next three diagonal pieces are the same and not empty (0)
      if (currentColorValue !== 0 &&
          currentColorValue === gridBoard[y - 1][x + 1] &&
          currentColorValue === gridBoard[y - 2][x + 2] &&
          currentColorValue === gridBoard[y - 3][x + 3]) {
        console.log(`Positive slope diagonal win starting at (${y}, ${x})!`);
        return true; 
      }
    }
  }
  // No winner found on the positive slope diagonal
  return false; 
}

// Checks if anyone won diagonally with a negative slope
function negativeSlopeWin() {
  // Start from row 0 (top-most possible for a diagonal)
  for (let y = 0; y < GRIDY - 3; y++) { 
    // Stop at the last possible column for a diagonal
    for (let x = 0; x < GRIDX - 3; x++) { 
      let currentColorValue = gridBoard[y][x];
      
      // Check if the current piece and the next three diagonal pieces are the same and not empty (0)
      if (currentColorValue !== 0 &&
          currentColorValue === gridBoard[y + 1][x + 1] &&
          currentColorValue === gridBoard[y + 2][x + 2] &&
          currentColorValue === gridBoard[y + 3][x + 3]) {
        console.log(`Negative slope diagonal win starting at (${y}, ${x})!`);
        return true; 
      }
    }
  }
  // No winner found on the negative slope diagonal
  return false;
}


// Checks if anyone has won
function determineIfWinner() {
  if (horizontalWin() || verticalWin() || positiveSlopeWin() || negativeSlopeWin()) {
    console.log("We have a winner!");
  }
}

function draw() {
  if (shared.board) {
    gridBoard = shared.board;
  }

  // Changes game state variable
  changeGameStates();

  // Calls functions depending on game state
  callGameStates();

  // Check if there is a winner
  determineIfWinner();
}