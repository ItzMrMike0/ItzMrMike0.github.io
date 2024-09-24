// Traffic Light Starter Code
// Michael Yang
// 9/24/2024

// GOAL: make a 'traffic light' simulator. For now, just have the light
// changing according to time. You may want to investigate the millis()
// function at https://p5js.org/reference/#/p5/millis

let state = "red"
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
  //box
  rectMode(CENTER);
  fill(0);
  rect(width/2, height/2, 75, 200, 10);
  //lights
  fill(255);
  // cycle colors
  changeLight();
}

function changeLight() {
  if (state === "red") {
    fill("red");
    ellipse(width/2, height/2 - 65, 50, 50); //top
    if (millis() >= lastSwitchedTime + waitTime) {
      lastSwitchedTime = millis();
      state = "yellow"
    }
  }
  else if (state === "yellow"){
    fill("yellow");
    ellipse(width/2, height/2, 50, 50); //middle
    if (millis() >= lastSwitchedTime + waitTime/2) {
      lastSwitchedTime = millis();
      state = "green"
  }
}
  else if (state === "green"){
    fill("green");
    ellipse(width/2, height/2 + 65, 50, 50); //bottom
    if (millis() >= lastSwitchedTime + waitTime) {
      lastSwitchedTime = millis()
      state = "red"
  }
}
}