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
let randomCard = {}; // Stores the most recently drawn card
let cardImages = {}; // Stores all card images
let fadeAlpha = 0; // Variable for fade-in effect
let fadeSpeed = 0.5; // Speed of the fade-in effect
let isPlayer; // Variable for who busted
let bgMusic; // Background music
let cardDrawSoundFx; // Drawing a card sound fx
let cardGivingSoundFx; // Starting hand sound fx
let cardShuffleSoundFx; // Shuffle cards sound fx
let playerHandAndScore = {// Stores player's hand and score
  playerHand: [], // Array to hold the player's cards
  playerScore: 0, // Total score of the player's hand
};
let dealerHandAndScore = {// Stores dealers's hand and score
  dealerHand: [], // Array to hold the dealers's cards
  dealerScore: 0, // Total score of the dealer's hand
};


// Preload function to load all card images
function preload() {
  // Preloading all sounds
  bgMusic = loadSound("bgmusic.mp3");
  cardDrawSoundFx = loadSound("carddraw.ogg");
  cardGivingSoundFx = loadSound("cardgiving.ogg");
  cardShuffleSoundFx = loadSound("cardshuffle.ogg");

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

function setup() {
  createCanvas(windowWidth* 0.9, windowHeight * 0.8);
  // Background music setup
  bgMusic.loop(0, 1, 1, 0.5);
  bgMusic.amp(0.1);
  // Creates a deck with all 52 possible cards
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
  background(45, 153, 255, fadeAlpha);
  textSize(50);
  textAlign(CENTER);
  text("Blackjack", width/2, height/2);
  text("Click to Start", width/2, height * 0.9);
}

// Draws the four cards needed at the start of the game
function startingHands() {
  cardGivingSoundFx.play(0, 1, 1, 0, 1.2);
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
  background(45, 153, 255, fadeAlpha);
  // Checks if player score isn't over 21
  if (playerHandAndScore.playerScore <= 21) {
    if (drawCard === true) {
      cardDrawSoundFx.play();
      let randomIndex = round(random(0, deck.length - 1)); 
      randomCard = deck[randomIndex];
      playerHandAndScore.playerHand.push(randomCard);  
      updatePlayerScore(randomCard.rank, true);
      deck.splice(randomIndex, 1);  
      drawCard = false;
    }
    displayAllCards();
  }
  // If player score is over 21
  else {
    drawCard = false;
    isPlayer = true;
    gameState = "busted";
  }
}

// Draws a random card from the deck, gives it to the dealer, and displays it
function dealerDraw() {
  // Only draw if dealer score is less than 21
  if (dealerHandAndScore.dealerScore < 21) {
    cardDrawSoundFx.play();
    let randomIndex = round(random(0, deck.length - 1)); 
    randomCard = deck[randomIndex];
    dealerHandAndScore.dealerHand.push(randomCard);  
    updatePlayerScore(randomCard.rank, false);
    deck.splice(randomIndex, 1);  

    // Check if the dealer busts after drawing
    if (dealerHandAndScore.dealerScore > 21) {
      isPlayer = false;
      gameState = "busted"
    }
  }
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
    // S for "stand", dealer draws cards and results are given
    if (key === "s") {
      gameState = "userStand";
    }
  }
  // Reset game if user or dealer has bust or if the game is over after userStand
  if (gameState === "busted" || gameState === "userStand") {
    if (key === "r") {
      resetGame();
    }
  }
}

// If user hand goes over 21
function bustScreen() {
  if (isPlayer === true) {
    background(255, 0, 0, fadeAlpha);
    text("YOU WENT OVER 21!", width/2, height *0.1);
    text("PRESS R TO RESET", width/2, height * 0.9);
  }
  else {
    background(0, 255, 0, fadeAlpha);
    text("THE DEALER WENT OVER 21!" , width/2, height * 0.1);
    text("PRESS R TO RESET", width/2, height * 0.9);
  }
  displayAllCards();
}

// Reset game state
function resetGame() {
  cardShuffleSoundFx.play(0, 1, 1, 0, 1.5);

  gameState = "title"; 
  fadeAlpha = 0;
  fadeSpeed = 0.5;

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
  //Title screen
  if (gameState === "title") {
    titleScreen();
  }
  // Starts the game 
  else if (gameState === "gameStarted") {
    playerDraw();
  }
  // If the user pressed S and has stood
  else if (gameState === "userStand") {
    background(45, 153, 255);
    displayAllCards();
    while (dealerHandAndScore.dealerScore < 17) {
      dealerDraw();
      // If the dealer busts, break the loop 
      if (dealerHandAndScore.dealerScore > 21) {
        break;
      }
    }
    // Only show winner if neither player or dealer busted
    if (playerHandAndScore.playerScore <= 21 && dealerHandAndScore.dealerScore <= 21) {
      resultsCalculation();
    }
  }
  else if (gameState === "busted") {
    bustScreen();
  }
}

// Determines the winner between the player and dealer
function resultsCalculation() {
  // If player hand is bigger than dealers
  if (playerHandAndScore.playerScore > dealerHandAndScore.dealerScore) {
    fadeSpeed = 2.5;
    background(0, 255, 0, fadeAlpha);
    displayAllCards();
    text("YOU WON!", width/2, height/2);
    text("PRESS R TO RESET", width/2, height * 0.8);
  }
  // If dealer hand is bigger than players
  else if (playerHandAndScore.playerScore < dealerHandAndScore.dealerScore) {
    fadeSpeed = 2.5;
    background(255, 0, 0, fadeAlpha);
    displayAllCards();
    text("DEALER WON!", width/2, height/2);
    text("PRESS R TO RESET", width/2, height * 0.8);
  }
  // If both player and dealer have the same hand
  else {
    fadeSpeed = 1.5;
    background(45, 153, 255, fadeAlpha);
    displayAllCards();
    text("TIE!", width/2, height/2);
    text("PRESS R TO RESET", width/2, height * 0.6);
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
  
  // Update fade effect for title screen
  if (gameState === "title" && fadeAlpha < 255) {
    fadeAlpha += fadeSpeed; // Increase alpha for fade-in
  } 
  else if (gameState === "gameStarted" && fadeAlpha < 255) {
    fadeAlpha += fadeSpeed; // Increase alpha for fade-in
  }
  else if (gameState === "userStand" && fadeAlpha < 255) {
    fadeAlpha += fadeSpeed;
  } 

  // Updates game state and visuals
  stateChange();
}