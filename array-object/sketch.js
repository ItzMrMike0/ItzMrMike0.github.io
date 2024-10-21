// Arrays and Object Notation - BLACKJACK
// Michael Yang
// 10/21/2024
// Extra for Experts: Added CSS background and centered window using CSS.

let gameState = "title"; // Can be "title", "gameStarted", "userStand", "busted"
let suits = ["Spades", "Clubs", "Hearts", "Diamonds"]; // Possible suits for cards
let ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King", "Ace"]; // Possible ranks for cards
let deck = []; // All cards are stored here unless removed from play
let drawCard = true; // Flag to control whether a card can be drawn for player
let startingDeal = true; // Flag to prevent hitting or standing during the initial deal
let randomCard = {}; // Stores the most recently drawn card
let cardImages = {}; // Stores all card images
let fadeAlpha = 0; // Variable for fade-in effect
let fadeSpeed = 0.5; // Speed of the fade-in effect
let isPlayer; // Variable to determine if the player or dealer busted
let bgMusic; // Background music
let sounds = {}; // Store all sound effects
let playerHandAndScore = { playerHand: [], playerScore: 0 }; // Player's hand and score
let dealerHandAndScore = { dealerHand: [], dealerScore: 0 }; // Dealer's hand and score

// Preload function to load all card images
function preload() {
  // Preloading all sounds
  sounds.bgMusic = loadSound("bgmusic.mp3");
  sounds.cardDrawSoundFx = loadSound("carddraw.ogg");
  sounds.cardGivingSoundFx = loadSound("cardgiving.ogg");
  sounds.cardShuffleSoundFx = loadSound("cardshuffle.ogg");

  // Load images for all cards in the deck
  for (let s of suits) {
    for (let r of ranks) {
      // Determine the suit character based on the suit name
      let suitChar = "";
      if (s === "Clubs") {
        suitChar = "C";
      } else if (s === "Diamonds") {
        suitChar = "D";
      } else if (s === "Hearts") {
        suitChar = "H";
      } else if (s === "Spades") {
        suitChar = "S";
      }

      // Create a variable based on the rank and suit
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
  createCanvas(windowWidth * 0.9, windowHeight * 0.8);
  // Background music setup
  sounds.bgMusic.loop(0, 1, 1, 0.5);
  sounds.bgMusic.amp(0.1);
  // Creates a deck with all 52 possible cards
  for (let s of suits) {
    for (let r of ranks) {
      // Create an object for each card with suit and rank
      deck.push({ suit: s, rank: r });
    }
  }
}

function mouseClicked() {
  // Transition from title screen to game
  if (gameState === "title") {
    // Gives starting hands for dealer and player
    startingHands();
    gameState = "gameStarted";
  }
}

// Title screen
function titleScreen() {
  // The alpha value creates a fade-in effect
  background(45, 153, 255, fadeAlpha);
  textSize(50);
  textAlign(CENTER);
  text("Blackjack", width / 2, height / 2);
  text("Click to Start", width / 2, height * 0.9);
}

// Gives the initial hands for the player and dealer one card at a time
function startingHands() {
  sounds.cardGivingSoundFx.play(0, 1, 1, 0, 1.2);

  // Gives the first card for the player
  playerDraw(0); 

  // Set a timeout to give the second card after a delay
  setTimeout(() => {
    drawCard = true; 
    playerDraw(0);

    // Draw one card for dealer
    setTimeout(() => {
      dealerDraw(0);
      
      // Flag that allows user to start hitting or standing
      startingDeal = false;
    }, 500);
  }, 500);
}

// Displays a card image
function displayIndividualCard(card, x, y) {
  let cardKey = `${card.rank} of ${card.suit}`;
  image(cardImages[cardKey], x, y); 
}

// Displays all card images
function displayAllCardsAndText() {
  // Display the player's drawn card images
  for (let i = 0; i < playerHandAndScore.playerHand.length; i++) {
    let card = playerHandAndScore.playerHand[i];
    // Arrange cards horizontally
    displayIndividualCard(card, width * 0.1 + i * 50, height * 0.25);
  }
  // Display the dealer's drawn card images
  for (let i = 0; i < dealerHandAndScore.dealerHand.length; i++) {
    let card = dealerHandAndScore.dealerHand[i];
    // Arrange cards horizontally
    displayIndividualCard(card, width * 0.7 + i * 50, height * 0.25);
  }
  // Display scores for both player and dealer
  text("Score: " + playerHandAndScore.playerScore, width * 0.2, height * 0.9);
  text("Score: " + dealerHandAndScore.dealerScore, width * 0.8, height * 0.9);
  text("Player Hand", width * 0.2, height * 0.175);
  text("Dealer Hand", width * 0.80, height * 0.175);
}

// Drawing card sound effect
function drawCardSfx(howLoud) {
  sounds.cardDrawSoundFx.amp(howLoud);
  sounds.cardDrawSoundFx.play();
}

// Card Logic
function cardLogic(player) {
  // Picks a random card from deck
  let randomIndex = Math.floor(random(0, deck.length)); 
  randomCard = deck[randomIndex];

  // Set isAdjusted only for Aces
  if (randomCard.rank === "Ace") {
    randomCard.isAdjusted = false; // Initialize only Aces
  }

  // If player is drawing a new card
  if (player) {
    // Push random card into player's hand
    playerHandAndScore.playerHand.push(randomCard);  
    // Update player score
    updateHandScore(randomCard.rank, true); 
  }
  // If dealer is drawing a new card
  else {
    // Push random card into dealer's hand
    dealerHandAndScore.dealerHand.push(randomCard);  
    // Update dealer score
    updateHandScore(randomCard.rank, false);
  }
  // Removes the random drawn card from deck
  deck.splice(randomIndex, 1);  
}

// Draws a random card from the deck, gives it to the player, and displays it
function playerDraw(volume) {
  background(45, 153, 255, fadeAlpha);
  // Checks if player score isn't over 21
  if (playerHandAndScore.playerScore <= 21) {
    if (drawCard === true) {
      // Play card drawing sound effect
      drawCardSfx(volume);
      // Handle card logic for player
      cardLogic(true);
      // Prevent further draws until the next hit
      drawCard = false;
    }
    // Update screen
    displayAllCardsAndText();
  }
  // If player score is over 21, change gameState to busted
  else {
    drawCard = false;
    isPlayer = true;
    gameState = "busted";
  }
}

// Draws a random card from the deck, gives it to the dealer, and displays it
function dealerDraw(volume) {
  // Play card drawing sound effect
  drawCardSfx(volume);
  // Handle card logic for dealer
  cardLogic(false);
  // Update screen
  displayAllCardsAndText();
}

// Function to keep drawing cards for the dealer until their score is 17 or more
function dealerDrawUntilStand() {
  if (dealerHandAndScore.dealerScore < 17) {
    // Draw the card and update the screen
    dealerDraw(1);
    
    // Timeout so dealer takes time between draws
    setTimeout(() => {
      dealerDrawUntilStand(); // Call to keep drawing if score is still below 17
    }, 500); 
    // If the dealer has more than 17 but is not more than 21
  } else if (dealerHandAndScore.dealerScore <= 21) {
    // If the dealer stands, update game state
    gameState = "userStand";
  }
  // Dealer has more than 21
  else {
    gameState = "busted";
  }
}

// Adds and updates score based on drawn cards
function updateHandScore(rank, isPlayer) {
  let randomCardValue = 0;

  if (typeof rank === "number") {
    // For number cards (2-10)
    randomCardValue = rank; 
  } else if (rank === "Jack" || rank === "Queen" || rank === "King") {
    // Face cards are worth 10
    randomCardValue = 10; 
  } else if (rank === "Ace") {
    // Ace is worth 1 or 11 
    // If adding 11 makes hand go over 21 add 1 instead
    if (isPlayer && playerHandAndScore.playerScore + 11 > 21 || !isPlayer && dealerHandAndScore.dealerScore + 11 > 21) {
      randomCardValue = 1;
      
      // Adjust the Ace in the hand
      for (let card of (isPlayer ? playerHandAndScore.playerHand : dealerHandAndScore.dealerHand)) {
        if (card.rank === "Ace" && !card.isAdjusted) {
          card.isAdjusted = true; // Mark the Ace as adjusted
          break; // Adjust only the first Ace found
        }
      }
    } else {
      // If adding 11 does not make hand go over 21 add 11
      randomCardValue = 11;
    }
  }
  
  // Update scores
  if (isPlayer) {
    // Update player score
    playerHandAndScore.playerScore += randomCardValue;

    // If user went over 21 and has any aces in hand it will adjust
    playerHandAndScore.playerScore = adjustAcesIfNeeded(playerHandAndScore.playerHand, playerHandAndScore.playerScore);
  } else {
    // Update dealer score
    dealerHandAndScore.dealerScore += randomCardValue;

    // If dealer went over 21 and has any aces in hand it will adjust
    dealerHandAndScore.dealerScore = adjustAcesIfNeeded(dealerHandAndScore.dealerHand, dealerHandAndScore.dealerScore);
  }
}

// Adjusts aces that are set to 11 to 1
function adjustAcesIfNeeded(hand, score) {
  if (score > 21) {
    for (let card of hand) {
      // Check if the card is an Ace with value 11 and hasn't been adjusted
      if (card.rank === "Ace" && !card.isAdjusted) {
        score -= 10; // Change Ace from 11 to 1
        card.value = 1; // Adjust the Ace's value
        card.isAdjusted = true; // Mark the Ace as adjusted
        break; // Adjust one Ace only
      }
    }
  }
  return score;
}

// Checks for player input to draw, stand, or reset
function keyPressed() {
  // Checks if user is out of starting hand draw
  if (!startingDeal) {
    // "H" for hit, draws another card
    if (gameState === "gameStarted") {
      if (key === "h") {
        // Reset drawCard flag 
        drawCard = true;
      }
      // "S" for stand, dealer draws cards and results are given
      if (key === "s") {
        // Start drawing for the dealer
        dealerDrawUntilStand();
      }
    }
    // Reset game if user or dealer has bust or if the game shows results
    if (gameState === "busted" || gameState === "userStand") {
      if (key === "r") {
        resetGame();
      }
    }
  }
}

// If hand goes over 21
function bustScreen() {
  fadeSpeed = 1;
  // If player goes over 21
  if (isPlayer === true) {
    background(255, 0, 0, fadeAlpha);
    text("YOU WENT OVER 21!", width / 2, height * 0.1);
  }
  // If dealer goes over 21
  else {
    background(0, 255, 0, fadeAlpha);
    text("THE DEALER WENT OVER 21!", width / 2, height * 0.1);
  }
  // Instructions
  text("PRESS R TO RESET", width / 2, height * 0.9);
  displayAllCardsAndText();
}

// Reset everything
function resetGame() {
  sounds.cardShuffleSoundFx.play(0, 1, 1, 0, 1.5);

  // Reset game state
  gameState = "title";
  
  // Reset alpha value
  fadeAlpha = 0;

  // Setting fadeSpeed high so reseting fade in is fast
  fadeSpeed = 30;

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
  // Resetting flags
  drawCard = true; 
  startingDeal = true;
  isPlayer = undefined;
}

// Handles updates to game
function gameChanges() {
  // Update fade effect for everything
  if (fadeAlpha < 255) {
    fadeAlpha += fadeSpeed; // Increase alpha for fade-in
  } 

  // Title screen
  if (gameState === "title") {
    // Resets fadeSpeed 
    fadeSpeed = 0.5;
    titleScreen();
  }
  // Starts the game 
  else if (gameState === "gameStarted") {
    playerDraw(1);
    text("H for Hit", width * 0.4, height * 0.95);
    text("S for Stand", width * 0.6, height * 0.95);
  }
  // If the user pressed S and has stood
  else if (gameState === "userStand") {
    background(45, 153, 255);
    // Only show winner if neither player nor dealer busted
    if (playerHandAndScore.playerScore <= 21 && dealerHandAndScore.dealerScore <= 21) {
      // Calculates and displays results
      resultsCalculation();
    }
  } else if (gameState === "busted") {
    bustScreen();
  }
}

// Determines the winner between the player and dealer
function resultsCalculation() {
  // If player hand is bigger than dealer's
  if (playerHandAndScore.playerScore > dealerHandAndScore.dealerScore) {
    fadeSpeed = 2.5;
    background(0, 255, 0, fadeAlpha);
    text("YOU WON!", width / 2, height / 2);
  }
  // If dealer hand is bigger than player's
  else if (playerHandAndScore.playerScore < dealerHandAndScore.dealerScore) {
    fadeSpeed = 2.5;
    background(255, 0, 0, fadeAlpha);
    text("DEALER WON!", width / 2, height / 2);
  }
  // If both player and dealer have the same hand
  else {
    fadeSpeed = 2.5;
    background(128, 128, 128, fadeAlpha);
    text("TIE!", width / 2, height / 2);
  }
  // Show results and instructions
  displayAllCardsAndText();
  text("PRESS R TO RESET", width / 2, height * 0.8);
}

// Loop for entire project
function draw() {
  // Updates game state and visuals
  gameChanges();
}