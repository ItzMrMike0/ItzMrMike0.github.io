// Grid Based Game
// Michael Yang
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let gameState = ""; // noLobby, inGame
let pos;
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
  createCanvas(1400, windowHeight);

  // Set circleSize based on the smaller dimension of the window
  circleSize = min(1400 / GRIDX, windowHeight / GRIDY);

  // Create an empty local grid
  gridBoard = generateEmptyGrid(GRIDY, GRIDX);
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

// Show the grid and the colour that the circle is
function displaySharedGrid() {
  // Check if shared.board exists before accessing it
  if (!shared.board) {
    return;
  }
  
  background("black");

  // Sets colour of circles in grid
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
  // Text showing if it's your turn
  currentPlayerTurnText();
}

// Show text to either the Host or the guest if it's their turn
function currentPlayerTurnText() {
  textSize(50);
  fill("white");

  // Host (player 1)
  if (partyIsHost() && shared.currentTurn) {
    text("Your turn!", width * 0.8, height * 0.1);
  }
  // Guest (player 2)
  else if (!partyIsHost() && !shared.currentTurn) {
    text("Your turn!", width * 0.8, height * 0.1);
  }
}

// If no code is typed in during prompt
function noLobby() {
  background("red");
  textAlign(CENTER, CENTER);
  textSize(70);
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
      }
    }
  }
}

function createAndJoinRoom() {
  // If a room is created/joined, display the shared ellipse; otherwise, bring back to noLobby
  if (room) {
    gameState = "inGame";
  }
  else {
    gameState = "noLobby";
  }
}

function mousePressed() {
  let cordX = Math.floor(mouseX / circleSize);
  let cordY = Math.floor(mouseY / circleSize);


  // Checks if mouse is clicked on grid
  if (cordX >= 0 && cordY >= 0 && cordX < GRIDX && cordY < GRIDY) {
    // Host (Player 1) can only place a piece if it's their turn
    if (partyIsHost() && shared.currentTurn) {
      // Host colour is red (1)
      placePiece(cordX, cordY, 1);
      // Switch to guest's turn
      shared.currentTurn = false; 
    }
    // Guest (Player 2) can only place a piece if it's their turn
    else if (!partyIsHost() && !shared.currentTurn) {
      // Host colour is yellow (2)
      placePiece(cordX, cordY, 2);
      // Switch to host's turn 
      shared.currentTurn = true; 
    }

    // Sync local grid with shared grid using partySetShared
    partySetShared(shared, { board: gridBoard, currentTurn: shared.currentTurn });
  }
}

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

function draw() {
  // Synchronize local grid with shared grid so it stays updated
  if (shared.board) {
    gridBoard = shared.board;
  }

  // Change game states
  changeGameStates();


  // Handle room connection logic
  createAndJoinRoom();
}