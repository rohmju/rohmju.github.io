const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];
let playerCards = [];
let dealerCards = [];
let chips = 1000;
let currentBet = 0;

const dealerDiv = document.getElementById("dealer-cards");
const playerDiv = document.getElementById("player-cards");
const statusDiv = document.getElementById("status");
const chipsSpan = document.getElementById("chips");

function updateChipsDisplay() {
  chipsSpan.textContent = chips.toString();
}

function createDeck() {
  const d = [];
  for (let suit of suits) {
    for (let value of values) {
      d.push({ suit, value });
    }
  }
  return d;
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function drawCard(hand, container) {
  const card = deck.pop();
  hand.push(card);
  const span = document.createElement("span");
  span.textContent = `${card.value}${card.suit} `;
  container.appendChild(span);
}

function calculateValue(hand) {
  let sum = 0;
  let aces = 0;

  for (let card of hand) {
    if (['J', 'Q', 'K'].includes(card.value)) {
      sum += 10;
    } else if (card.value === 'A') {
      sum += 11;
      aces += 1;
    } else {
      sum += parseInt(card.value);
    }
  }

  while (sum > 21 && aces > 0) {
    sum -= 10;
    aces--;
  }

  return sum;
}

function startGame() {
  const betInput = document.getElementById("bet-input");
  const bet = parseInt(betInput.value);

  if (isNaN(bet) || bet <= 0 || bet > chips) {
    alert("Ungültiger Einsatz.");
    return;
  }

  currentBet = bet;
  chips -= bet;
  updateChipsDisplay();

  document.getElementById("game").style.display = "block";
  statusDiv.innerText = "";

  deck = createDeck();
  shuffle(deck);

  playerCards = [];
  dealerCards = [];

  playerDiv.innerHTML = "";
  dealerDiv.innerHTML = "";

  drawCard(playerCards, playerDiv);
  drawCard(dealerCards, dealerDiv);
  drawCard(playerCards, playerDiv);
  drawCard(dealerCards, dealerDiv);

  document.getElementById("hit-button").disabled = false;
  document.getElementById("stand-button").disabled = false;
}

function hit() {
  drawCard(playerCards, playerDiv);
  const val = calculateValue(playerCards);
  if (val > 21) {
    endGame("Bust! Du verlierst.");
  }
}

function stand() {
  while (calculateValue(dealerCards) < 17) {
    drawCard(dealerCards, dealerDiv);
  }

  const playerVal = calculateValue(playerCards);
  const dealerVal = calculateValue(dealerCards);

  if (dealerVal > 21 || playerVal > dealerVal) {
    winGame();
  } else if (dealerVal === playerVal) {
    drawGame();
  } else {
    endGame("Dealer gewinnt. Du verlierst.");
  }
}

function winGame() {
  const winnings = currentBet * 2;
  chips += winnings;
  updateChipsDisplay();
  endGame("Du gewinnst!");
}

function drawGame() {
  chips += currentBet;
  updateChipsDisplay();
  endGame("Unentschieden. Dein Einsatz wurde zurückgegeben.");
}

function endGame(message) {
  document.getElementById("hit-button").disabled = true;
  document.getElementById("stand-button").disabled = true;
  statusDiv.innerText = message;
}

document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("hit-button").addEventListener("click", hit);
document.getElementById("stand-button").addEventListener("click", stand);

updateChipsDisplay();