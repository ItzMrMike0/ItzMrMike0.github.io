// Arrays and Object Notation
// Michael Yang
// 10/8/2024
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let suits = ["spades", "clubs", "hearts", "diamonds"];
let ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king" , "ace"];
let deck = [];
let drawCard = true;
let randomCard = [];


function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let s of suits) {
    for (let r of ranks) {
      deck.push(s + " " + r);
    }
  }
}

function draw() {
  console.log(deck);
  background(220);
  playerDraw();
}

function playerDraw() {
  if (drawCard === true) {
    randomCard = deck[round(random(0, 51))];
    // deck.pop(randomCard);
    drawCard = false;
  }
  text(randomCard, width/2, height/2); 
}
