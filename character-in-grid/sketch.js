// Grid Demo
// Michael Yang
// Oct 22, 2024

let grid;
const GRID_SIZE = 10;
let cellSize;
let shouldToggleNeighbours = false;
const OPEN_TILE = 0;
const IMPASSIBLE_TILE = 1;
const PLAYER_TILE = 9;
let player = {
  x: 0,
  y: 0,
};
let grass;
let road;

function preload() {
  grass = loadImage("grass.jpg");
  road = loadImage("road.jpg");
}

function setup() {
  if (windowWidth < windowHeight) {
    createCanvas(windowWidth, windowWidth);
  }
  else {
    createCanvas(windowHeight, windowHeight);
  }
  cellSize = height/GRID_SIZE;
  grid = generateRandomGrid(GRID_SIZE, GRID_SIZE);

  // add player to the grid
  grid[player.y][player.x] = PLAYER_TILE;
}

function windowResized() {
  if (windowWidth < windowHeight) {
    resizeCanvas(windowWidth, windowWidth);
  }
  else {
    resizeCanvas(windowHeight, windowHeight);
  }
  cellSize = height/GRID_SIZE;
}

function draw() {
  background(220);
  displayGrid();
}

function keyPressed() {
  if (key === "r") {
    grid = generateRandomGrid(GRID_SIZE, GRID_SIZE);  
  }
  if (key === "e") {
    grid = generateEmptyGrid(GRID_SIZE, GRID_SIZE);
  }
  if (key === "n") {
    shouldToggleNeighbours = !shouldToggleNeighbours;
  }
  if (key === "w") {
    // move up
    movePlayer(player.x, player.y - 1);
  }
  if (key === "s") {
    // move down
    movePlayer(player.x, player.y + 1);
  }
  if (key === "a") {
    // move down
    movePlayer(player.x - 1, player.y);
  }
  if (key === "d") {
    // move down
    movePlayer(player.x + 1, player.y);
  }
}

function movePlayer(x, y) {
  // don't run off the screen
  if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE && grid[y][x] === OPEN_TILE) {
    /// when moving, reset to an open spot
    grid[player.y][player.x] = OPEN_TILE;
  
    // keep track of player location
    player.x = x;
    player.y = y;
  
    // put player in grid
    grid[player.y][player.x] = PLAYER_TILE;
  }
}

function displayGrid() {
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (grid[y][x] === IMPASSIBLE_TILE) {
        image(grass, x * cellSize, y * cellSize, cellSize, cellSize);
      }
      else if ( grid[y][x] === OPEN_TILE){
        image(road, x * cellSize, y * cellSize, cellSize, cellSize);
      } 
      else if(grid[y][x] === PLAYER_TILE) {
        fill("lightpink");
        square(x * cellSize, y * cellSize, cellSize);
      }
    }
  }
}

function generateRandomGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      //choose either 0 or 1, each 50% of the time
      if (random(100) < 50) {
        newGrid[y].push(IMPASSIBLE_TILE);
      }
      else {
        newGrid[y].push(OPEN_TILE);
      }
    }
  }
  return newGrid;
}

function generateEmptyGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      newGrid[y].push(OPEN_TILE);
    }
  }
  return newGrid;
}

function mousePressed() {
  let cordX = Math.floor(mouseX/cellSize);
  let cordY = Math.floor(mouseY/cellSize);

  // toggle self
  toggleCell(cordX, cordY);

  // toggle neighbours
  if (shouldToggleNeighbours) {
    toggleCell(cordX + 1, cordY);
    toggleCell(cordX - 1, cordY);
    toggleCell(cordX, cordY + 1);
    toggleCell(cordX, cordY - 1);
  }
}

function toggleCell(cordX, cordY) {
  // make sure cell you're toggling is in the grid
  if (cordX >= 0 && cordY>= 0 && cordX < GRID_SIZE && cordY < GRID_SIZE) {
    if (grid[cordY][cordX] === OPEN_TILE) {
      grid[cordY][cordX] = IMPASSIBLE_TILE;
    }
    else if (grid[cordY][cordX] === IMPASSIBLE_TILE) {
      grid[cordY][cordX] = OPEN_TILE;    
    } 
  } 
}