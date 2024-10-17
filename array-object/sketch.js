// Arrays and Object Notation
// Michael Yang
// 10/8/2024
// Extra for Experts:
// Added CSS background and centered window using CSS.


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
let cardImages = {};

// Preload function to load all card images
function preload() {
  for (let s of suits) {
    for (let r of ranks) {
      // Determine the suit character based on the suit name
      let suitChar = '';
      if (s === "Clubs") {
        suitChar = 'C';
      }
      else if (s === "Diamonds") {
        suitChar = 'D';
      }
      else if (s === "Hearts") {
        suitChar = 'H';
      }
      else if (s === "Spades") {
        suitChar = 'S';
      }

      // Create a file name based on the rank and suit
      let cardName;
      if (typeof r === 'number') {
        cardName = `${r}${suitChar}`; 
      } 
      // Face Cards
      else {
        cardName = `${r.charAt(0)}${suitChar}`; 
      }
      cardImages[`${r} of ${s}`] = loadImage(`assets/cards/${cardName}.svg`);
    }
  }
}

// Creates a deck with all 52 possible cards
function setup() {
  createCanvas(windowWidth* 0.9, windowHeight * 0.8);
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
  background(51, 153, 255, 7);
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

// Use this function to display a card image
function displayCard(card, x, y) {
  let cardKey = `${card.rank} of ${card.suit}`;
  image(cardImages[cardKey], x, y); // Adjust position as needed
}

// Update playerDraw function to use the card images
function playerDraw() {
  background(51, 153, 255);
  if (playerHandAndScore.playerScore < 21) {
    if (drawCard === true) {
      let randomIndex = round(random(0, deck.length - 1)); 
      randomCard = deck[randomIndex];
      playerHandAndScore.playerHand.push(randomCard);  
      updatePlayerScore(randomCard.rank);
      deck.splice(randomIndex, 1);  
      drawCard = false;
    }

    // Display the drawn card image
    for (let i = 0; i < playerHandAndScore.playerHand.length; i++) {
      let card = playerHandAndScore.playerHand[i];
      displayCard(card, width * 0.45 + (i * 30), height * 0.3);
    }
    text("Score: " + playerHandAndScore.playerScore, width / 2, height * 0.9);
  }
  else {
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