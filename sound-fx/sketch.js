// Sound Effects Demo
// Michael Yang
// 10/16/2024

let bgMusicLoop;
let mainTheme;

function preload() {
  bgMusicLoop = loadSound("bgmusic.ogg");
  mainTheme = loadSound("mainmusic.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgMusicLoop.amp(0.3);
}

function draw() {
  background(220);
}


function keyPressed() {
  if (!bgMusicLoop.isPlaying()) {
    bgMusicLoop.loop();  
  }
}

function mousePressed() {
  mainTheme.play();
}