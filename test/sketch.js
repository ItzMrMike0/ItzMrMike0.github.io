function setup() {
  createCanvas(windowWidth, windowHeight);
}

// Function to draw centered text
function drawCenteredText(text, size, y, color, font = "Verdana") {
  textSize(size);
  fill(color);
  textFont(font);
  let x = width / 2 - textWidth(text) / 2;
  text(text, x, y);
}

function draw() {
  background(220);
  drawCenteredText("hello", 25, height / 2, "black");
}