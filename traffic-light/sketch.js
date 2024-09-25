// Traffic Light Starter Code
// Michael Yang
// 9/24/2024

// GOAL: make a 'traffic light' simulator. For now, just have the light
// changing according to time. You may want to investigate the millis()
// function at https://p5js.org/reference/#/p5/millis

let state = "red";
let waitTime = 3000;
let lastSwitchedTime = 0;

function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(255);
  drawOutlineOfLights();
}

function drawOutlineOfLights() {
  // Box
  rectMode(CENTER);
  fill(0);
  rect(width / 2, height / 2, 75, 200, 10);
  
  // Cycle colors
  changeLight();
}

function changeLight() {
  if (state === "red") {
    fill("red");
    ellipse(width / 2, height / 2 - 65, 50, 50); // Top
    if (millis() >= lastSwitchedTime + waitTime) {
      lastSwitchedTime = millis();
      state = "green";
    }
  } else if (state === "green") {
    fill("green");
    ellipse(width / 2, height / 2 + 65, 50, 50); // Bottom
    if (millis() >= lastSwitchedTime + waitTime) {
      lastSwitchedTime = millis();
      state = "yellow";
    }
  } else if (state === "yellow") {
    fill("yellow");
    ellipse(width / 2, height / 2, 50, 50); // Middle
    if (millis() >= lastSwitchedTime + waitTime / 1.5) {
      lastSwitchedTime = millis();
      state = "red";
    }
  }

  } 