// Square Moving Around Screen
// Sept 19, 2024


let x = 0;
let y = 0;
let speed = 5;
let size = 50;

function setup() {
  createCanvas(400, 400);
}

function mouseWheel(event) {
  if (event.delta > 0) {
    size -= 5;
  } else {
    size += 5;
  }
}

function squareSettings() {
  fill("red");
  square(x, y, size);
}

function moveSquare() {
  if (x < width - size && y === 0) {
    x += speed;
  }
  if (x === width - size && y < height - size) {
    y += speed;
  }
  if (y === height - size && x !== 0) {
    x -= speed;
  }
  if (x === 0 && y != 0) {
    y -= speed;
  }
}

function draw() {
  background(220);
  squareSettings();
  moveSquare();
}
