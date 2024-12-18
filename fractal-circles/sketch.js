// Fractal Circle Demo
// Using Recursion

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  recursiveCircle(width/2, height/2, mouseX);
}

function recursiveCircle(x, y, radius) {
  circle(x ,y, radius*2);
  
  // exit clause
  if (radius > 30) {
    recursiveCircle(x - radius/2, y, radius/2);
    recursiveCircle(x + radius/2, y, radius/2);
  }
}
