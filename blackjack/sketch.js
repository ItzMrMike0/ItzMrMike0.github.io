// Arrays and Object Notation
// Michael Yang
// 10/8/2024
// Extra for Experts:
// Sound and Window Resizing

let suits = ["spades", "clubs", "hearts", "diamonds"];
let ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king" , "ace"];
let deck = [];
let drawCard = true;
let randomCard = [];
let playerHand = [];

// Creates a deck with all 52 possible cards
function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let s of suits) {
    for (let r of ranks) {
      deck.push(s + " " + r);
    }
  }
}

// Draw a new card
function playerDraw() {
  if (drawCard === true) {
    let randomIndex = round(random(0, deck.length - 1)); 
    // Pick a random card
    randomCard = deck[randomIndex];
    playerHand.push(randomCard);  

    // Remove picked card from deck array
    deck.splice(randomIndex, 1);  
    drawCard = false;
  }
  text(randomCard, width / 2, height / 2); 
}

// If user hits h for "hit" to draw another card
function hitCard() {
  keyPressed();
}

// Hit or Stand
function keyPressed() {
  if (key === 'h') {
    drawCard = true;
    playerDraw();
  }
}

function draw() {
  console.log(deck);
  console.log(playerHand);
  background(220);
  playerDraw();
}