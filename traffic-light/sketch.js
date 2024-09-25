// Traffic Light Starter Code
// Michael Yang
// 9/24/2024

// GOAL: make a 'traffic light' simulator. For now, just have the light
// changing according to time. You may want to investigate the millis()
// function at https://p5js.org/reference/#/p5/millis

let state = "green";
let lastSwitchedTime = 0;
const LIGHT_DURATION = 3000;

function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(255);
  drawOutlineOfLights();
  // Cycle colors
  changeLight();
}

function drawOutlineOfLights() {
  // Box
  rectMode(CENTER);
  fill(0);
  rect(width / 2, height / 2, 75, 200, 10);
}

function changeLight() {
  if (state === "red") {
    fill("red");
    ellipse(width / 2, height / 2 - 65, 50, 50); // Top
    if (millis() >= lastSwitchedTime + LIGHT_DURATION * 1.5 ) {
      lastSwitchedTime = millis();
      state = "green";
    }
  } 
  else if (state === "green") {
    fill("green");
    ellipse(width / 2, height / 2 + 65, 50, 50); // Bottom
    if (millis() >= lastSwitchedTime + LIGHT_DURATION) {
      lastSwitchedTime = millis();
      state = "yellow";
    }
  } 
  else if (state === "yellow") {
    fill("yellow");
    ellipse(width / 2, height / 2, 50, 50); // Middle
    if (millis() >= lastSwitchedTime + LIGHT_DURATION / 1.5) {
      lastSwitchedTime = millis();
      state = "red";
    }
  }
} 
