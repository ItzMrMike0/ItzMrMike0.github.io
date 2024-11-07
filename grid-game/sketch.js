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
  circleSize = min(width / GRIDX, height / GRIDY);

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


// Displays board
function displaySharedGrid() {
  // Makes sure grid is shared
  if (!shared.board) {
    return;
  }

  background("black");

  // Limit the width of the grid to 80% of the screen width for additional space on the sides
  let maxGridWidth = width * 0.8;
  
  // Set circle size based on the smaller dimension (either width or height)
  circleSize = min(maxGridWidth / GRIDX, height / GRIDY);

  // Calculate offset to center the grid
  let offsetX = (width - GRIDX * circleSize) / 2;
  let offsetY = (height - GRIDY * circleSize) / 2;
 
  // Center the grid
  translate(offsetX, offsetY); 

  // Sets colour to each piece
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
  fill("black")
  text("Please refresh and type in a code!", width / 2, height / 2);
}

// Calls functions depending on gameState
function changeGameStates() {
  if (gameState === "noLobby") {
    noLobby();
  }
  if (gameState === "inGame") {
    if (room) {
      // Check if shared.board is defined
      if (shared.board) { 
        // Display the shared board for all players
        displaySharedGrid();
        // Show which player's turn it is
        displayTurnText();  
      }
    }
  }
}

// If a room is created/joined, display the shared game. Otherwise, bring back to noLobby
function createAndJoinRoom() {
  if (room) {
    gameState = "inGame";
  }
  else {
    gameState = "noLobby";
  }
}

function mousePressed() {
  // Adjust mouseX to account for the translation (centering)
  let offsetX = (width - GRIDX * circleSize) / 2;
  let offsetY = (height - GRIDY * circleSize) / 2;

  // Calculate coordinates relative to the centered grid
  let cordX = Math.floor((mouseX - offsetX) / circleSize);
  let cordY = Math.floor((mouseY - offsetY) / circleSize);

  // Make sure the click is within the grid bounds
  if (cordX >= 0 && cordX < GRIDX && cordY >= 0 && cordY < GRIDY) {
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

// Text showing which player's turn it is
function displayTurnText() {
  fill("white");
  textSize(32);
  textAlign(CENTER, CENTER);

  let turnText;

  // Text variable to whose turn it is
  if (shared.currentTurn) {
    turnText = "Player 1's Turn (Red)"
  }
  else {
    turnText = "Player 2's Turn (Yellow)";
  }

  // Display text at the bottom of the screen
  text(turnText, width * 0.7, height * 0.1);
}

function draw() {
  if (shared.board) {
    gridBoard = shared.board;
  }
  changeGameStates();
  createAndJoinRoom();
}
