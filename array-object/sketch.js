// Arrays and Object Notation
// Michael Yang
// 10/8/2024
// Extra for Experts:
// Sound and Window Resizing


let gameState = "title"; // Current state of the game, can be "title" or "gameStarted"
let suits = ["Spades", "Clubs", "Hearts", "Diamonds"]; // Possible suits for cards
let ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King" , "Ace"]; // Possible ranks for cards
let deck = []; // All cards are stored here unless removed from play
let drawCard = true; // Flag to control card drawing
let randomCard = {}; // Stores the most recently drawn card
let playerHandAndScore = {// Stores player's hand and   score
  playerHand: [], // Array to hold the player's cards
  playerScore: 0, // Total score of the player's hand
};
// Creates a deck with all 52 possible cards
function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let s of suits) {
    for (let r of ranks) {
      // Create an object for each card with suit and rank
      deck.push({suit: s, rank: r});
    }
  }
  // Draw 2 cards for player and 2 for dealer at the start
  startingHands();
}

// Game State Changer
function mouseClicked() {
  // Title to game
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

// Draws the four cards needed at the start of the game
function startingHands() {
  for (x = 0; x < 1; x++) {
    playerDraw();
    drawCard = true;
  }
}

// Draw a new card
function playerDraw() {
  background(51, 153, 255);
  if (playerHandAndScore.playerScore < 21) {
    if (drawCard === true) {
      let randomIndex = round(random(0, deck.length - 1)); 
  
      // Pick a random card from the deck
      randomCard = deck[randomIndex];
      playerHandAndScore.playerHand.push(randomCard);  
  
      // Update the player's score based on the drawn card's rank
      updatePlayerScore(randomCard.rank);
  
      // Remove picked card from deck array to avoid drawing it again
      deck.splice(randomIndex, 1);  
  
      // Set drawCard flag
      drawCard = false;
    }

    // Display the drawn card and current score
    text(`${randomCard.rank} of ${randomCard.suit}`, width/2, height * 0.6);
    text("Score: " + playerHandAndScore.playerScore, width/2, height * 0.7);
    text("Hand: " + playerHandAndScore.playerHand.map( card => {
      return `${card.rank} of ${card.suit} `;
    }), width * 0.3,   height * 0.9);
  }
  else {
    // Went over 21 BUSTED
    bustScreen();
    drawCard = false;
  }
}
// Adds and updates score based on drawn cards
function updatePlayerScore(rank) {
  let randomCardValue = 0;
  if (typeof rank === "number") {
    // For number cards (2-10)
    randomCardValue = rank; 
  } 
  else if (rank === "Jack" || rank === "Queen" || rank === "King") {
    // Face cards are worth 10
    randomCardValue = 10; 
  } 
  else if (rank === "Ace") {
    // Ace is worth 1
    randomCardValue = 1;
  }
  // Add the value of the drawn card to the total score
  playerHandAndScore.playerScore += randomCardValue;
}
// If user hits h for "hit" to draw another card
function hitCard() {
  keyPressed();
}
// Checks for player input to draw or stand
function keyPressed() {
  // H for "hit", draws another card
  if (gameState !== "title") {
    if (key === 'h') {
      // Reset drawCard flag
      drawCard = true;
      playerDraw();
    }
  }
}

// If user hand goes over 21
function bustScreen() {
  background("red");
  text(`${randomCard.rank} of ${randomCard.suit}`, width/2, height /2 );
  text("Score: " + playerHandAndScore.playerScore, width/2, height * 0.9);
  text("BUST!", width/2, height *0.1);
}

// Handles state changes in the game
function stateChange() {
  //Title screen to game
  if (gameState === "title") {
    titleScreen();
  }
  // If the game has started, display game state
  else if (gameState === "gameStarted") {
    background(220);
    playerDraw();
  }
}
// Loop for entire project
function draw() {
  // Debugging logs
  console.log(gameState);
  console.log(deck);
  console.log(playerHandAndScore);
  console.log(randomCard);
  // Updates game state and visuals
  stateChange();
}