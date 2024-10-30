// Grid Based Game
// Michael Yang
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let gameState = ""; // noLobby, inGame
let whoseTurn = "red"; // Flag to determine whose turn it is
let pos;
let room; // Variable to hold the room code
let shared; // Variable for shared data
let gridBoard; // Grid for the game
let circleSize; // Variable for circle size
const GRIDX = 7; // Cols
const GRIDY = 6; // Rows

function preload() {
  // Prompt user for room code
  room = prompt("Enter room code to create/join a party");
  
  // Connect to the p5.party server and the specific room
  partyConnect("wss://demoserver.p5party.org", room);

  // Load shared position data
  pos = partyLoadShared("pos", { x: width / 2, y: height / 2 });
  shared = partyLoadShared("shared", { x: 0, y: 0 });
}

function setup() {
  // Create canvas
  createCanvas(windowWidth, windowHeight);

  // Set circleSize based on the smaller dimension of the window
  circleSize = min(width / GRIDX, height / GRIDY);

  // Create an empty grid
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
function displayGrid() {
  // 
  background("black");
  for (let y = 0; y < GRIDY; y++) {
    for (let x = 0; x < GRIDX; x++) {
      if (gridBoard[y][x] === 2) {
        fill("yellow");
      }
      else if (gridBoard[y][x] === 1) {
        fill("red");
      }
      else {
        gridBoard[y][x] === 0; {
          fill("white");
        }
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
    displayGrid();
  }
}

function createAndJoinRoom() {
  // If a room is created/joined, display the shared ellipse; otherwise, bring back to noLobby
  if (room) {
    fill("red");
    gameState = "inGame";
    ellipse(shared.x, shared.y, 100, 100);
  }
  else {
    gameState = "noLobby";
  }
}

function mousePressed() {
  if (room) {
    // Update the shared position when mouse is pressed
    shared.x = mouseX;
    shared.y = mouseY;
  }
}

function draw() {
  // Change game states
  changeGameStates();

  // Create or join a room with another player through p5party
  createAndJoinRoom();
}