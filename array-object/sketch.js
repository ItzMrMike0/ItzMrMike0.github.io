// Arrays and Object Notation
// Michael Yang
// 10/8/2024
// Extra for Experts:
// Sound and Window Resizing


let gameState = "title"; // Current state of the game, can be "title", "gameStarted", "bust", "results"
let suits = ["Spades", "Clubs", "Hearts", "Diamonds"]; // Possible suits for cards
let ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King" , "Ace"]; // Possible ranks for cards
let deck = []; // All cards are stored here unless removed from play
let drawCard = true; // Flag to control card drawing
let dealerdealon = false;
let randomCard = {}; // Stores the most recently drawn card
let playerHandAndScore = { // Stores player's hand and score
  playerHand: [], // Array to hold the player's cards
  playerScore: 0, // Total score of the player's hand
};
let dealerHandAndScore = { // Stores dealer's hand and score
  dealerHand: [], // Array to hold the dealer's cards
  dealerScore: 0, // Total score of the player's hand
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
  dealerDraw(true); // Draw one card for the dealer at the start
}

// Draw a new card for the player
function playerDraw() {
  background(51, 153, 255);
  if (playerHandAndScore.playerScore < 21) {
    if (drawCard === true) {
      let randomIndex = round(random(0, deck.length - 1)); 
  
      // Pick a random card from the deck
      randomCard = deck[randomIndex];
      playerHandAndScore.playerHand.push(randomCard);  
  
      // Update the player's score based on the drawn card's rank
      UpdateScore(randomCard.rank);
  
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
    bustScreen(true);
    drawCard = false;
  }
}

function dealerDraw(initial = false) {
  if (initial) {
    // Draw only one card for the dealer at the start
    let randomIndex = round(random(0, deck.length - 1));
    randomCard = deck[randomIndex];
    dealerHandAndScore.dealerHand.push(randomCard);
    UpdateScore(randomCard.rank, false); // Update dealer score
    deck.splice(randomIndex, 1); // Remove the drawn card from the deck
  } else {
    // Dealer draws until score is 17 or higher
    while (dealerHandAndScore.dealerScore < 17) {
      let randomIndex = round(random(0, deck.length - 1));
      randomCard = deck[randomIndex];
      dealerHandAndScore.dealerHand.push(randomCard);
      UpdateScore(randomCard.rank, false); // Update dealer score
      deck.splice(randomIndex, 1); // Remove the drawn card from the deck

      // Check if dealer busts after drawing a card
      if (dealerHandAndScore.dealerScore > 21) {
        bustScreen(false); // Call bust screen for dealer
        break; // Exit the loop if bust
      }
    }
    gameState = "results"
  }
}


// Adds and updates score based on drawn cards
function UpdateScore(rank, isPlayer = true) {
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
  if (isPlayer) {
    playerHandAndScore.playerScore += randomCardValue;
  } else {
    dealerHandAndScore.dealerScore += randomCardValue; // Update dealer score
  }
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
    else if (key === 's') {
      dealerDraw();
    }
  }
}


function determineWinner() {
  if (playerHandAndScore.playerScore > dealerHandAndScore.dealerHand) {
    textSize(60);
    text("PLAYER WINS!", width/2, height/2);
  }
  else if (playerHandAndScore.playerScore === dealerHandAndScore.dealerHand) {
    textSize(60);
    text("TIE", width/2, height/2);
  }
  else {
    textSize(60);
    text("DEALER WINS", width/2, height/2);
  }
}

// If user hand goes over 21
function bustScreen(player) {
  if (player) {
    background("red");
    text(`${randomCard.rank} of ${randomCard.suit}`, width/2, height / 2);
    text("Score: " + playerHandAndScore.playerScore, width/2, height * 0.9);
    text("YOU BUST!", width/2, height * 0.1);
    gameState = "bust"; // Set game state to bust
  } else {
    background("red");
    text(`${randomCard.rank} of ${randomCard.suit}`, width/2, height / 2);
    text("Score: " + dealerHandAndScore.dealerScore, width/2, height * 0.9);
    text("DEALER BUST!", width/2, height * 0.1);
    gameState = "bust"; 
  }
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
    text("Dealer Score: " + dealerHandAndScore.dealerScore, width / 2, height * 0.8);
    text("Dealer Hand: " + dealerHandAndScore.dealerHand.map( card => {
      return `${card.rank} of ${card.suit} `;
    }), width * 0.2,   height * 0.2);
  }
  else if (gameState === "bust") {
  }
  else if (gameState === "results") {
  background(51, 153, 255);
    determineWinner();
    text("Dealer Score: " + dealerHandAndScore.dealerScore, width / 2, height * 0.8);
    text("Dealer Hand: " + dealerHandAndScore.dealerHand.map( card => {
      return `${card.rank} of ${card.suit} `;
    }), width * 0.2,   height * 0.2);
  }
}

// Loop for entire project
function draw() {
  // Debugging logs
  console.log(gameState);
  console.log(deck);
  console.log(playerHandAndScore);
  console.log(randomCard);
  console.log(dealerHandAndScore);

  // Updates game state and visuals
  stateChange();
}