import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = 'https://whanfrajisrghcsktdyv.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoYW5mcmFqaXNyZ2hjc2t0ZHl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTg4NDA5NiwiZXhwIjoyMDY3NDYwMDk2fQ.B84xlTaviNSb4tGRVbIoAL6KlvEOQVYAm8PXqyPv6q8"
const supabase = createClient(supabaseUrl, supabaseKey)

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
let playerMoney = 0;
let currentBet = 0;
let username = '';

// Get username from the userInfo cookie only
async function getUsernameFromCookie() {
  const cookies = document.cookie.split(';').map(c => c.trim());
  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === 'userInfo') {
      try {
        // Instead of JSON.parse, parse like "Monkey|1000"
        const decoded = decodeURIComponent(value);
        console.log('Raw userInfo cookie:', decoded);
        const parts = decoded.split('|');
        return parts[0] || null;
      } catch (e) {
        console.error('Error parsing userInfo cookie:', e);
        return null;
      }
    }
  }
  return null;
}


// Load player money only from DB (ignore cookie money)
async function loadPlayerMoney() {
  if (!username) {
    setMessage('No username found in cookies.');
    console.warn('Username is null or empty.');
    return;
  }
  const { data, error } = await supabase
    .from('stonks')
    .select('money')
    .eq('username', username)
    .single();

  if (error) {
    setMessage('Error loading money: ' + error.message);
    console.error('Error fetching money from DB:', error);
    playerMoney = 1000; // fallback default
  } else if (data) {
    playerMoney = data.money;
    console.log('Loaded player money from DB:', playerMoney);
  } else {
    playerMoney = 1000; // default if no record found
    console.log('No money record found, using default 1000');
  }
  updateMoneyDisplay();
  updateButtons();
}

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

function renderHands() {
  dealerCardsElem.innerHTML = '';
  playerCardsElem.innerHTML = '';

  dealerHand.forEach((card, i) => {
    if (i === 0 && !gameOver && !playerStands) {
      dealerCardsElem.appendChild(createCardBackElement());
    } else {
      dealerCardsElem.appendChild(createCardElement(card));
    }
  });

  playerHand.forEach(card => {
    playerCardsElem.appendChild(createCardElement(card));
  });

  if (gameOver || playerStands) {
    dealerScoreElem.textContent = handValue(dealerHand);
  } else {
    if (dealerHand.length > 1) {
      dealerScoreElem.textContent = `? + ${handValue(dealerHand.slice(1))}`;
    } else {
      dealerScoreElem.textContent = '?';
    }
  }

  playerScoreElem.textContent = handValue(playerHand);
}

function updateButtons() {
  btnHit.disabled = gameOver || playerStands || currentBet === 0;
  btnStand.disabled = gameOver || playerStands || currentBet === 0;
  btnNew.disabled = !gameOver && currentBet === 0;
  betInput.disabled = currentBet > 0 && !gameOver;
  btnBet.disabled = currentBet > 0 && !gameOver;
}

function setMessage(text) {
  messageElem.textContent = text;
}

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

  playerHand.push(deck.pop());
  dealerHand.push(deck.pop());
  playerHand.push(deck.pop());
  dealerHand.push(deck.pop());

  renderHands();
  updateButtons();
  checkForBlackjack();
}

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

function playerStand() {
  if (gameOver) return;
  playerStands = true;
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

async function endRound(isPush = false, playerWon = false) {
  gameOver = true;
  updateButtons();

  if (isPush) {
    // no money change
  } else if (playerWon) {
    playerMoney += currentBet;
  } else {
    playerMoney -= currentBet;
  }

  currentBet = 0;
  updateMoneyDisplay();
  betInput.disabled = false;
  btnBet.disabled = false;
  btnHit.disabled = true;
  btnStand.disabled = true;

  const { error } = await supabase
    .from('stonks')
    .update({ money: playerMoney })
    .eq('username', username);

  if (error) {
    setMessage('Error updating money in database: ' + error.message);
    console.error('DB update error:', error);
  } else {
    console.log('Money updated in DB:', playerMoney);
  }
}

function updateMoneyDisplay() {
  moneyElem.textContent = playerMoney;
}

function placeBet() {
  if (!gameOver && currentBet > 0) {
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

btnHit.addEventListener('click', playerHit);
btnStand.addEventListener('click', playerStand);
btnNew.addEventListener('click', startGame);
btnBet.addEventListener('click', placeBet);

(async function init() {
  username = await getUsernameFromCookie();
  console.log('Username from cookie:', username);
  await loadPlayerMoney();
  updateButtons();
  setMessage('Place your bet to start.');
})();
