// Arrays and Object Notation
// Michael Yang
// 10/8/2024
// Extra for Experts:
// Sound and Window Resizing


let gameState = "title"; // Can be "title", "gameStarted",
let suits = ["spades", "clubs", "hearts", "diamonds"];
let ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king" , "ace"];
let deck = []; // All cards are stored here unless removed
let drawCard = true;
let randomCard = {};
let playerHandAndScore = {
  playerHand: [],
  playerScore: 0, // Will store total score as a number
};

// Creates a deck with all 52 possible cards
function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let s of suits) {
    for (let r of ranks) {
      deck.push({suit: s, rank: r});
    }
  }
}

// Title screen to game 
function mouseClicked() {
  if (gameState === "title") {
    gameState = "gameStarted";
  }
}

// Title screen
function titleScreen() {
  background(51, 153, 255);
  textSize(50);
  textAlign(CENTER);

  text("Blackjack", width/2, height/2);
  text("Click to Start", width/2, height * 0.9);
}

// Draw a new card
function playerDraw() {
  if (drawCard === true) {
    let randomIndex = round(random(0, deck.length - 1)); 
    // Pick a random card
    randomCard = deck[randomIndex];
    playerHandAndScore.playerHand.push(randomCard);  

    // Update score based on the drawn card
    updatePlayerScore(randomCard.rank);

    // Remove picked card from deck array
    deck.splice(randomIndex, 1);  
    drawCard = false;
  }

  text(`${randomCard.rank} of ${randomCard.suit}`, width/2, height /2 );
  text("Score: " + playerHandAndScore.playerScore, width/2, height * 0.9);
}

function updatePlayerScore(rank) {
  let randomCardValue = 0;

  if (typeof rank === "number") {
    // For number cards (2-10)
    randomCardValue = rank; 
  } 
  else if (rank === "jack" || rank === "queen" || rank === "king") {
    // Face cards are worth 10
    randomCardValue = 10; 
  } 
  else if (rank === "ace") {
    // Ace is worth 1
    randomCardValue = 1;
  }
  // Add up score
  playerHandAndScore.playerScore += randomCardValue;
}


// If user hits h for "hit" to draw another card
function hitCard() {
  keyPressed();
}

// Hit or stand
function keyPressed() {
  // Hit 
  if (gameState !== "title") {
    if (key === 'h') {
      drawCard = true;
      playerDraw();
    }
  }
}

// Game state function
function stateChange() {
  //Title screen to game
  if (gameState === "title") {
    titleScreen();
  }
  else if (gameState === "gameStarted") {
    background(220);
    playerDraw();
  }
}

function draw() {
  // Debugging logs
  console.log(gameState);
  console.log(deck);
  console.log(playerHandAndScore);
  console.log(randomCard);

  // Starts Game
  stateChange();
}