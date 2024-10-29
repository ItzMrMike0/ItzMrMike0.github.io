// Grid Based Game
// Michael Yang
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let logo;
let gameState = "titleScreen";
let pos;
let room; // Variable to hold the room code
let shared; // Variable for shared data
let guests;

function preload() {
  logo = loadImage("battleshiplogo.webp");
  
  // Prompt user for room code
  room = prompt("Enter room code to create/join a party");
  
  // Connect to the p5.party server and the specific room
  partyConnect("wss://demoserver.p5party.org", room);

  // Load shared position data
  pos = partyLoadShared("pos", { x: width / 2, y: height / 2 });
  shared = partyLoadShared("shared", { x: 0, y: 0 });
  guests = partyLoadGuestShareds();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function titleScreen() {
  background(237, 237, 249);
  textAlign(CENTER, CENTER);
  image(logo, width / 2.6, height * 0.1, logo.width / 2, logo.height / 2);
}

function draw() {
  if (gameState === "titleScreen") {
    titleScreen();
  }

  // If a room is created/joined, display the shared ellipse; otherwise, bring back to titleScreen
  if (room && guests.length >= 2) {
    fill("red");
    ellipse(shared.x, shared.y, 100, 100);
  }
  else {
    titleScreen();
  }
}

function mousePressed() {
  if (room) {
    // Update the shared position when mouse is pressed
    shared.x = mouseX;
    shared.y = mouseY;
  }
}