// Blackjack Game logic and UI

// Card suits and ranks
const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Map rank to values (A can be 1 or 11, handled separately)
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

// Elements
const dealerCardsElem = document.getElementById('dealer-cards');
const playerCardsElem = document.getElementById('player-cards');
const dealerScoreElem = document.getElementById('dealer-score');
const playerScoreElem = document.getElementById('player-score');
const messageElem = document.getElementById('message');

const btnHit = document.getElementById('btn-hit');
const btnStand = document.getElementById('btn-stand');
const btnNew = document.getElementById('btn-new');

let deck = [];
let dealerHand = [];
let playerHand = [];
let gameOver = false;
let playerStands = false;

function createDeck() {
  const newDeck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      newDeck.push({ suit, rank });
    }
  }
  return newDeck;
}

function shuffle(deck) {
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function cardValue(card) {
  return RANK_VALUES[card.rank];
}

function handValue(hand) {
  let value = 0;
  let aceCount = 0;

  for (const card of hand) {
    value += cardValue(card);
    if (card.rank === 'A') aceCount++;
  }

  // Adjust for Aces if bust
  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount--;
  }

  return value;
}

function isBust(hand) {
  return handValue(hand) > 21;
}

function dealerShouldHit() {
  return handValue(dealerHand) < 17;
}

function createCardElement(card) {
  const cardDiv = document.createElement('div');
  cardDiv.classList.add('card');

  // Color red for hearts and diamonds
  if (card.suit === '♥' || card.suit === '♦') {
    cardDiv.classList.add('red');
  }

  // Top-left rank + suit
  const topLeft = document.createElement('div');
  topLeft.classList.add('corner', 'top-left');
  topLeft.textContent = `${card.rank}\n${card.suit}`;
  cardDiv.appendChild(topLeft);

  // Center suit symbol
  const centerSuit = document.createElement('div');
  centerSuit.classList.add('suit-center');

  // Add suit specific class for color
  switch (card.suit) {
    case '♥':
      centerSuit.classList.add('suit-hearts');
      break;
    case '♦':
      centerSuit.classList.add('suit-diamonds');
      break;
    case '♣':
      centerSuit.classList.add('suit-clubs');
      break;
    case '♠':
      centerSuit.classList.add('suit-spades');
      break;
  }
  centerSuit.textContent = card.suit;
  cardDiv.appendChild(centerSuit);

  // Bottom-right rank + suit (rotated)
  const bottomRight = document.createElement('div');
  bottomRight.classList.add('corner', 'bottom-right');
  bottomRight.textContent = `${card.rank}\n${card.suit}`;
  cardDiv.appendChild(bottomRight);

  return cardDiv;
}

function renderHands() {
  // Clear current cards
  dealerCardsElem.innerHTML = '';
  playerCardsElem.innerHTML = '';

  // Dealer cards (show only one card if game not over and player hasn't stood)
  for (let i = 0; i < dealerHand.length; i++) {
    let cardElem;
    if (i === 0 || gameOver || playerStands) {
      cardElem = createCardElement(dealerHand[i]);
    } else {
      cardElem = createCardBackElement();
    }
    dealerCardsElem.appendChild(cardElem);
  }

  for (const card of playerHand) {
    const cardElem = createCardElement(card);
    playerCardsElem.appendChild(cardElem);
  }

  // Scores
  dealerScoreElem.textContent = playerStands || gameOver ? handValue(dealerHand) : `? + ${handValue(dealerHand.slice(1))}`;
  playerScoreElem.textContent = handValue(playerHand);
}

function createCardBackElement() {
  const back = document.createElement('div');
  back.classList.add('card');
  back.style.background = 'linear-gradient(135deg, #114B5F, #1A936F)';
  back.style.boxShadow = 'inset 0 0 10px rgba(255,255,255,0.3)';
  back.style.position = 'relative';

  // Add a pattern for card back
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

function startGame() {
  deck = createDeck();
  shuffle(deck);

  dealerHand = [];
  playerHand = [];
  gameOver = false;
  playerStands = false;
  messageElem.textContent = '';

  // Deal initial cards
  playerHand.push(deck.pop());
  dealerHand.push(deck.pop());
  playerHand.push(deck.pop());
  dealerHand.push(deck.pop());

  renderHands();
  updateButtons();
  checkForBlackjack();
}

function updateButtons() {
  btnHit.disabled = gameOver || playerStands;
  btnStand.disabled = gameOver || playerStands;
  btnNew.disabled = false;
}

function checkForBlackjack() {
  const playerVal = handValue(playerHand);
  const dealerVal = handValue(dealerHand);

  if (playerVal === 21 && dealerVal === 21) {
    messageElem.textContent = "Both have Blackjack! It's a push.";
    gameOver = true;
    playerStands = true;
    renderHands();
    updateButtons();
  } else if (playerVal === 21) {
    messageElem.textContent = "Blackjack! You win!";
    gameOver = true;
    playerStands = true;
    renderHands();
    updateButtons();
  } else if (dealerVal === 21) {
    messageElem.textContent = "Dealer has Blackjack. You lose.";
    gameOver = true;
    playerStands = true;
    renderHands();
    updateButtons();
  }
}

function playerHit() {
  if (gameOver || playerStands) return;
  playerHand.push(deck.pop());
  renderHands();

  if (isBust(playerHand)) {
    messageElem.textContent = "You busted! Dealer wins.";
    gameOver = true;
    playerStands = true;
  }
  updateButtons();
}

function playerStand() {
  if (gameOver) return;
  playerStands = true;
  // Dealer plays out
  dealerPlay();
}

function dealerPlay() {
  renderHands();
  while (dealerShouldHit()) {
    dealerHand.push(deck.pop());
    renderHands();
  }
  finishGame();
}

function finishGame() {
  const playerVal = handValue(playerHand);
  const dealerVal = handValue(dealerHand);

  if (isBust(dealerHand)) {
    messageElem.textContent = "Dealer busted! You win!";
  } else if (dealerVal > playerVal) {
    messageElem.textContent = "Dealer wins.";
  } else if (dealerVal < playerVal) {
    messageElem.textContent = "You win!";
  } else {
    messageElem.textContent = "It's a push.";
  }

  gameOver = true;
  updateButtons();
}

btnHit.addEventListener('click', playerHit);
btnStand.addEventListener('click', playerStand);
btnNew.addEventListener('click', startGame);

startGame();
