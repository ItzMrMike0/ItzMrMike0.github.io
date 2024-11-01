// Grid Based Game
// Michael Yang
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let gameState = ""; // noLobby, inGame
let whoseTurn = "red"; // Flag to determine whose turn it is
let pos;
let room; // Variable to hold the room code
let shared; // Variable for shared data
let gridBoard; // Local grid for the game
let circleSize; // Variable for circle size
const GRIDX = 7; // Cols
const GRIDY = 6; // Rows

function preload() {
  // Prompt user for room code
  room = prompt("Enter room code to create/join a party");

  // Connect to the p5.party server and the specific room
  partyConnect("wss://demoserver.p5party.org", room);

  // Initialize shared grid if not already initialized
  shared = partyLoadShared("grid", { board: generateEmptyGrid(GRIDY, GRIDX) });
}

function setup() {
  // Create canvas
  createCanvas(windowWidth, windowHeight);

  // Set circleSize based on the smaller dimension of the window
  circleSize = min(width / GRIDX, height / GRIDY);

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
}

// If no code is typed in during prompt
function noLobby() {
  background(237, 237, 249);
  textAlign(CENTER, CENTER);
  textSize(100);
  text("Please refresh and type in a code!", width/2, height/2);
}

// Calls functions depending on gameState
function changeGameStates() {
  if (gameState === "noLobby") {
    noLobby();
  }
  if (gameState === "inGame") {
    if (room) {
      if (shared.board) { // Check if shared.board is defined
        displaySharedGrid(); // Display the shared board for all players
      }
    }
  }
}

function createAndJoinRoom() {
  // If a room is created/joined, display the shared ellipse; otherwise, bring back to noLobby
  if (room) {
    fill("red");
    gameState = "inGame";
  }
  else {
    gameState = "noLobby";
  }
}

function mousePressed() {
  let cordX = Math.floor(mouseX/circleSize);
  let cordY = Math.floor(mouseY/circleSize);

  // Update local board with click on circle
  placePiece(cordX, cordY);
  // bruh();

  if (room) {
    // Sync local grid with shared grid using partySetShared
    partySetShared(shared, { board: gridBoard }); 
  }
}

function placePiece(cordX, cordY) {
  // Make sure cell you're toggling is in the grid
  if (cordX >= 0 && cordY >= 0 && cordX < GRIDX && cordY < GRIDY) {
    if (gridBoard[cordY][cordX] === 0) {
      gridBoard[cordY][cordX] = 1;
    }
    else {
      gridBoard[cordY][cordX] = 0;
    }
  }
}

// function bruh(cordX, cordY) {
//   let xcoord = floor(mouseX / circleSize);
//   for (let i = 6; i > 0; i--) {
//     if (gridBoard[i - 1][xcoord] === 0) {
//       gridBoard[i - 1][xcoord] = 1;
//     }
//   }
// }

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
