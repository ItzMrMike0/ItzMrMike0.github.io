// Image Demo
// Sept 23, 2024
let spongebob;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function preload() {
  spongebob = loadImage('spongebob.jpg');
}

function draw() {
  background(220);
  image(spongebob, mouseX, mouseY, width/2, height/2);
}
