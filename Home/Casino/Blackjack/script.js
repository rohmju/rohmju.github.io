// Blackjack Game logic and UI

const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const RANK_VALUES = {
  'A': 11,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'J': 10,
  'Q': 10,
  'K': 10
};

const dealerCardsElem = document.getElementById('dealer-cards');
const playerCardsElem = document.getElementById('player-cards');
const dealerScoreElem = document.getElementById('dealer-score');
const playerScoreElem = document.getElementById('player-score');
const messageElem = document.getElementById('message');

const btnHit = document.getElementById('btn-hit');
const btnStand = document.getElementById('btn-stand');
const btnNew = document.getElementById('btn-new');
const btnBet = document.getElementById('btn-bet');
const betInput = document.getElementById('bet-input');
const moneyElem = document.getElementById('money');

let deck = [];
let dealerHand = [];
let playerHand = [];
let gameOver = false;
let playerStands = false;
let playerMoney = 1000;
let currentBet = 0;

// Create deck of cards
function createDeck() {
  const newDeck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      newDeck.push({ suit, rank });
    }
  }
  return newDeck;
}

// Shuffle deck - Fisher-Yates
function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Calculate value of a card
function cardValue(card) {
  return RANK_VALUES[card.rank];
}

// Calculate hand value with ace adjustment
function handValue(hand) {
  let value = 0;
  let aceCount = 0;

  for (const card of hand) {
    value += cardValue(card);
    if (card.rank === 'A') aceCount++;
  }

  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount--;
  }

  return value;
}

// Check bust
function isBust(hand) {
  return handValue(hand) > 21;
}

// Dealer hits if under 17
function dealerShouldHit() {
  return handValue(dealerHand) < 17;
}

// Create card element for display
function createCardElement(card) {
  const cardDiv = document.createElement('div');
  cardDiv.classList.add('card');

  if (card.suit === '♥' || card.suit === '♦') {
    cardDiv.classList.add('red');
  }

  const topLeft = document.createElement('div');
  topLeft.classList.add('corner', 'top-left');
  topLeft.textContent = `${card.rank}\n${card.suit}`;
  cardDiv.appendChild(topLeft);

  const centerSuit = document.createElement('div');
  centerSuit.classList.add('suit-center');
  switch (card.suit) {
    case '♥': centerSuit.classList.add('suit-hearts'); break;
    case '♦': centerSuit.classList.add('suit-diamonds'); break;
    case '♣': centerSuit.classList.add('suit-clubs'); break;
    case '♠': centerSuit.classList.add('suit-spades'); break;
  }
  centerSuit.textContent = card.suit;
  cardDiv.appendChild(centerSuit);

  const bottomRight = document.createElement('div');
  bottomRight.classList.add('corner', 'bottom-right');
  bottomRight.textContent = `${card.rank}\n${card.suit}`;
  cardDiv.appendChild(bottomRight);

  return cardDiv;
}

// Create card back element (for hidden card)
function createCardBackElement() {
  const back = document.createElement('div');
  back.classList.add('card');
  back.style.background = 'linear-gradient(135deg, #114B5F, #1A936F)';
  back.style.boxShadow = 'inset 0 0 10px rgba(255,255,255,0.3)';
  back.style.position = 'relative';

  const pattern = document.createElement('div');
  pattern.style.position = 'absolute';
  pattern.style.top = '10px';
  pattern.style.left = '10px';
  pattern.style.right = '10px';
  pattern.style.bottom = '10px';
  pattern.style.background = 'repeating-linear-gradient(45deg, rgba(255,255,255,0.15) 0, rgba(255,255,255,0.15) 2px, transparent 2px, transparent 6px)';
  pattern.style.borderRadius = '8px';

  back.appendChild(pattern);
  return back;
}

// Render cards and scores
function renderHands() {
  dealerCardsElem.innerHTML = '';
  playerCardsElem.innerHTML = '';

  // Dealer cards: First card hidden unless game over or player stands
  dealerHand.forEach((card, i) => {
    if (i === 0 && !gameOver && !playerStands) {
      dealerCardsElem.appendChild(createCardBackElement());
    } else {
      dealerCardsElem.appendChild(createCardElement(card));
    }
  });

  // Player cards always shown
  playerHand.forEach(card => {
    playerCardsElem.appendChild(createCardElement(card));
  });

  // Dealer score: show "?" + value of other cards or full value if revealed
  if (gameOver || playerStands) {
    dealerScoreElem.textContent = handValue(dealerHand);
  } else {
    if (dealerHand.length > 1) {
      dealerScoreElem.textContent = `? + ${handValue(dealerHand.slice(1))}`;
    } else {
      dealerScoreElem.textContent = '?';
    }
  }

  // Player score always shown
  playerScoreElem.textContent = handValue(playerHand);
}

// Update buttons based on game state
function updateButtons() {
  btnHit.disabled = gameOver || playerStands || currentBet === 0;
  btnStand.disabled = gameOver || playerStands || currentBet === 0;
  btnNew.disabled = gameOver === false && currentBet === 0;
  betInput.disabled = currentBet > 0 && !gameOver; // disable bet input once bet placed and game active
  btnBet.disabled = currentBet > 0 && !gameOver;  // disable bet button once bet placed and game active
}

// Show message in UI
function setMessage(text) {
  messageElem.textContent = text;
}

// Start a new game round
function startGame() {
  if (currentBet === 0) {
    setMessage('Place a bet to start the game.');
    return;
  }
  deck = createDeck();
  shuffle(deck);
  dealerHand = [];
  playerHand = [];
  gameOver = false;
  playerStands = false;
  setMessage('');

  // Initial deal: player and dealer get two cards each
  playerHand.push(deck.pop());
  dealerHand.push(deck.pop());
  playerHand.push(deck.pop());
  dealerHand.push(deck.pop());

  renderHands();
  updateButtons();
  checkForBlackjack();
}

// Check if player or dealer got blackjack at start
function checkForBlackjack() {
  const playerVal = handValue(playerHand);
  const dealerVal = handValue(dealerHand);

  if (playerVal === 21 && dealerVal === 21) {
    setMessage("Both have Blackjack! It's a push.");
    endRound(true);
  } else if (playerVal === 21) {
    setMessage("Blackjack! You win!");
    endRound(false, true);
  } else if (dealerVal === 21) {
    setMessage("Dealer has Blackjack. You lose.");
    endRound(false, false);
  }
}

// Player chooses to Hit
function playerHit() {
  if (gameOver || playerStands) return;
  playerHand.push(deck.pop());
  renderHands();

  if (isBust(playerHand)) {
    setMessage("You busted! Dealer wins.");
    endRound(false, false);
  }
  updateButtons();
}

// Player chooses to Stand
function playerStand() {
  if (gameOver) return;
  playerStands = true;
  dealerPlay();
}

// Dealer plays their turn
function dealerPlay() {
  renderHands();
  while (dealerShouldHit()) {
    dealerHand.push(deck.pop());
    renderHands();
  }
  finishGame();
}

// Finish game and determine winner
function finishGame() {
  const playerVal = handValue(playerHand);
  const dealerVal = handValue(dealerHand);

  if (isBust(dealerHand)) {
    setMessage("Dealer busted! You win!");
    endRound(false, true);
  } else if (dealerVal > playerVal) {
    setMessage("Dealer wins.");
    endRound(false, false);
  } else if (dealerVal < playerVal) {
    setMessage("You win!");
    endRound(false, true);
  } else {
    setMessage("It's a push.");
    endRound(true);
  }
}

// End round and update money
// push == isPush: no money lost or won
// playerWon: true if player wins, false if loses, undefined if push
function endRound(isPush = false, playerWon = false) {
  gameOver = true;
  updateButtons();

  if (isPush) {
    // Bet returned, no change
  } else if (playerWon) {
    playerMoney += currentBet; // Win amount equals bet (1:1 payout)
  } else {
    playerMoney -= currentBet; // Lose bet
  }
  currentBet = 0;
  updateMoneyDisplay();
  betInput.disabled = false;
  btnBet.disabled = false;
  btnHit.disabled = true;
  btnStand.disabled = true;
}

// Update money displayed on screen
function updateMoneyDisplay() {
  moneyElem.textContent = playerMoney;
}

// Place bet button clicked
function placeBet() {
  if (gameOver === false && currentBet > 0) {
    setMessage("Finish current round before placing new bet.");
    return;
  }
  const bet = parseInt(betInput.value);
  if (isNaN(bet) || bet <= 0) {
    setMessage("Please enter a valid bet.");
    return;
  }
  if (bet > playerMoney) {
    setMessage("You don't have enough money for that bet.");
    return;
  }
  currentBet = bet;
  setMessage(`Bet placed: $${currentBet}. Click 'New Game' to start.`);

  updateButtons();
}

// Event listeners
btnHit.addEventListener('click', playerHit);
btnStand.addEventListener('click', playerStand);
btnNew.addEventListener('click', startGame);
btnBet.addEventListener('click', placeBet);

// Initialize money display and buttons on load
updateMoneyDisplay();
updateButtons();
setMessage('Place your bet to start.');
