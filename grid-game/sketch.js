// Grid Based Game
// Michael Yang
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let logo;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function preload() {
  logo = loadImage("battleshiplogo.webp");
}

function titleScreen() {
  background(237, 237, 249);
  textAlign(CENTER, CENTER);
  image(logo, width/2.6, height * 0.1, logo.width/2, logo.height/2);
}

function draw() {
  titleScreen();
}
