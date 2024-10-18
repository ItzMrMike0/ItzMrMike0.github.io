// Arrays and Object Notation
// Michael Yang
// 10/8/2024
// Extra for Experts:
// Added CSS background and centered window using CSS.


let gameState = "title"; // Can be "title", "gameStarted", "userStand", "busted"
let suits = ["Spades", "Clubs", "Hearts", "Diamonds"]; // Possible suits for cards
let ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King" , "Ace"]; // Possible ranks for cards
let deck = []; // All cards are stored here unless removed from play
let drawCard = true; // Flag to control card drawing
let justStarted = true;
let randomCard = {}; // Stores the most recently drawn card
let playerHandAndScore = {// Stores player's hand and score
  playerHand: [], // Array to hold the player's cards
  playerScore: 0, // Total score of the player's hand
};
let dealerHandAndScore = {// Stores dealers's hand and score
  dealerHand: [], // Array to hold the dealers's cards
  dealerScore: 0, // Total score of the dealer's hand
};
let cardImages = {};

// Preload function to load all card images
function preload() {
  for (let s of suits) {
    for (let r of ranks) {
      // Determine the suit character based on the suit name
      let suitChar = "";
      if (s === "Clubs") {
        suitChar = "C";
      }
      else if (s === "Diamonds") {
        suitChar = "D";
      }
      else if (s === "Hearts") {
        suitChar = "H";
      }
      else if (s === "Spades") {
        suitChar = "S";
      }

      // Create a file name based on the rank and suit
      let cardName;
      if (typeof r === "number") {
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
}

// Game State Changer
function mouseClicked() {
  // Title to game
  if (gameState === "title") {
    // Gives starting hands for dealer and player
    startingHands();
    gameState = "gameStarted";
  }
}

// Title screen
function titleScreen() {
  // The alpha value makes it fade in which is cool
  background(45, 153, 255, 3.5);
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
  dealerDraw();
}

// Use this function to display a card image
function displayIndividualCard(card, x, y) {
  let cardKey = `${card.rank} of ${card.suit}`;
  image(cardImages[cardKey], x, y); // Adjust position as needed
}

function displayAllCards() {
  // Display the player drawn card images
  for (let i = 0; i < playerHandAndScore.playerHand.length; i++) {
    let card = playerHandAndScore.playerHand[i];
    //Puts cards to the right of each other
    displayIndividualCard(card, width * 0.1 + i * 50, height * 0.25);
  }

  // Display the dealer drawn card images
  for (let i = 0; i < dealerHandAndScore.dealerHand.length; i++) {
    let card = dealerHandAndScore.dealerHand[i];
    //Puts cards to the right of each other
    displayIndividualCard(card, width * 0.7 + i * 50, height * 0.25);
  }
  text("Score: " + playerHandAndScore.playerScore, width * 0.2, height * 0.9);
  text("Score: " + dealerHandAndScore.dealerScore, width * 0.8, height * 0.9);
  text("Player Hand", width * 0.2, height * 0.175);
  text("Dealer Hand", width * 0.80, height * 0.175);
}

// Draws a random card from the deck, gives it to the player, and displays it
function playerDraw() {
  background(45, 153, 255);
  // Checks if player score isn't over 21 or else bust
  if (playerHandAndScore.playerScore <= 21) {
    if (drawCard === true) {
      let randomIndex = round(random(0, deck.length - 1)); 
      randomCard = deck[randomIndex];
      playerHandAndScore.playerHand.push(randomCard);  
      updatePlayerScore(randomCard.rank, true);
      deck.splice(randomIndex, 1);  
      drawCard = false;
    }
    displayAllCards();
  }
  else {
    bustScreen(true);
    drawCard = false;
  }
}

// Draws a random card from the deck, gives it to the dealer, and displays it
function dealerDraw() {
  let randomIndex = round(random(0, deck.length - 1)); 
  randomCard = deck[randomIndex];
  dealerHandAndScore.dealerHand.push(randomCard);  
  updatePlayerScore(randomCard.rank, false);
  deck.splice(randomIndex, 1);  
}

// Adds and updates score based on drawn cards
function updatePlayerScore(rank, player) {
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
  if (player) {
    playerHandAndScore.playerScore += randomCardValue;
  }
  else {
    dealerHandAndScore.dealerScore += randomCardValue;
  }
}

// Checks for player input to draw or stand
function keyPressed() {
  // H for "hit", draws another card
  if (gameState === "gameStarted") {
    if (key === "h") {
      // Reset drawCard flag 
      drawCard = true;
    }
    if (key === "s") {
      gameState = "userStand"
    }
  }
  if (gameState === "busted") {
    if (key === "r") {
      resetGame();
    }
  }
}

// If user hand goes over 21
function bustScreen(player) {
  background("red");
  displayAllCards();
  if (player) {
    text("YOU WENT OVER 21! BUST!", width/2, height *0.1);
  }
  else {
    text("THE DEALER WENT OVER 21! BUST!" , width/2, height * 0.1);
  }
  gameState = "busted"
}

// Reset game state
function resetGame() {
  gameState = "title"; 

  // Clear player and dealer hands and scores
  playerHandAndScore.playerHand = [];
  playerHandAndScore.playerScore = 0;
  dealerHandAndScore.dealerHand = [];
  dealerHandAndScore.dealerScore = 0;
  
  // Reset the deck
  deck = [];
  for (let s of suits) {
    for (let r of ranks) {
      deck.push({ suit: s, rank: r });
    }
  }

  // Reset the drawCard flag
  drawCard = true; 
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
  else if (gameState === "userStand") {
    playerDraw();
    while (dealerHandAndScore.dealerScore < 17) {
      dealerDraw();
    }    
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