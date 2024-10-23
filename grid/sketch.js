// Grid Demo
// Michael Yang
// Oct 22, 2024

// If hardcoding the grid, use something like this
// let grid = [[1, 0, 1, 0], [0, 0, 1 ,1],[1, 1, 1, 0], [0, 1, 1, 0]];

let grid;
const GRID_SIZE = 10;
let cellSize;
let shouldToggleNeighbours = true;

function setup() {
  if (windowWidth < windowHeight) {
    createCanvas(windowWidth, windowWidth);
  }
  else {
    createCanvas(windowHeight, windowHeight);
  }
  cellSize = height/GRID_SIZE;
  grid = generateRandomGrid(GRID_SIZE, GRID_SIZE);
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
}

function displayGrid() {
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (grid[y][x] === 1) {
        fill("black");
      }
      else {
        grid[y][x] === 0; {
          fill("white");
        }
      } 
      square(x * cellSize, y * cellSize, cellSize);
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
        newGrid[y].push(1);
      }
      else {
        newGrid[y].push(0);
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
      newGrid[y].push(0);
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
    if (grid[cordY][cordX] === 0) {
      grid[cordY][cordX] = 1;
    }
    else {
      grid[cordY][cordX] = 0;    
    } 
  } 
}