(() => {
  const suits = ["S", "H", "D", "C"];
  const values = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];

  let deck = [];
  let dealerHand = [];
  let playerHands = [];
  let currentHandIndex = 0;

  let balance = 1000;
  let bet = 0;

  const balanceDisplay = document.getElementById("balance-display");
  const betDisplay = document.getElementById("bet-display");
  const dealerCardsContainer = document.getElementById("dealer-cards");
  const dealerScoreDisplay = document.getElementById("dealer-score");
  const playerHandsContainer = document.getElementById("player-hands");
  const message = document.getElementById("message");

  const btnDeal = document.getElementById("btn-deal");
  const btnHit = document.getElementById("btn-hit");
  const btnStand = document.getElementById("btn-stand");
  const btnDouble = document.getElementById("btn-double");
  const btnSplit = document.getElementById("btn-split");
  const btnNew = document.getElementById("btn-new");
  const btnClearBet = document.getElementById("btn-clear-bet");

  const chipButtons = document.querySelectorAll(".chip");

  function createDeck() {
    deck = [];
    for (let s of suits) {
      for (let v of values) {
        deck.push({ suit: s, value: v });
      }
    }
  }

  function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  function drawCard() {
    if (deck.length === 0) {
      createDeck();
      shuffleDeck();
    }
    return deck.pop();
  }

  function getCardImage(card) {
    let code = card.value + card.suit;
    if (card.value === "10") code = "0" + card.suit;
    return `https://deckofcardsapi.com/static/img/${code}.png`;
  }

  function calculateScore(hand) {
    let score = 0;
    let aces = 0;
    for (let c of hand) {
      if (["J", "Q", "K"].includes(c.value)) score += 10;
      else if (c.value === "A") {
        aces++;
        score += 11;
      } else {
        score += Number(c.value);
      }
    }
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }
    return score;
  }

  function renderCards(container, hand, hideFirst = false) {
    container.innerHTML = "";
    hand.forEach((card, i) => {
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card");
      const img = document.createElement("img");
      if (hideFirst && i === 0) {
        img.src = "https://deckofcardsapi.com/static/img/back.png";
        img.alt = "Verdeckte Karte";
      } else {
        img.src = getCardImage(card);
        img.alt = card.value + card.suit;
      }
      cardDiv.appendChild(img);
      container.appendChild(cardDiv);
    });
  }

  function updateBalance() {
    balanceDisplay.textContent = `Guthaben: ${balance} €`;
    betDisplay.textContent = `Einsatz: ${bet} €`;
  }

  chipButtons.forEach((chip) => {
    chip.addEventListener("click", () => {
      const chipVal = Number(chip.dataset.value);
      if (balance >= chipVal) {
        bet += chipVal;
        balance -= chipVal;
        updateBalance();
        btnDeal.disabled = bet === 0;
      }
    });
  });

  btnClearBet.addEventListener("click", () => {
    balance += bet;
    bet = 0;
    updateBalance();
    btnDeal.disabled = true;
  });

  function renderPlayerHands() {
    playerHandsContainer.innerHTML = "";
    playerHands.forEach((handObj, idx) => {
      const handDiv = document.createElement("div");
      handDiv.classList.add("player-hand");
      if (idx === currentHandIndex) handDiv.classList.add("active");

      const title = document.createElement("div");
      title.classList.add("player-hand-title");
      title.textContent = `Spieler Hand ${idx + 1} (Einsatz: ${handObj.bet} €)`;
      handDiv.appendChild(title);

      const cardsDiv = document.createElement("div");
      cardsDiv.classList.add("cards");
      handDiv.appendChild(cardsDiv);

      renderCards(cardsDiv, handObj.cards);

      const scoreDiv = document.createElement("div");
      scoreDiv.textContent = `Punkte: ${calculateScore(handObj.cards)}`;
      handDiv.appendChild(scoreDiv);

      playerHandsContainer.appendChild(handDiv);
    });
  }

  function canSplit(hand) {
    return (
      hand.cards.length === 2 &&
      hand.cards[0].value === hand.cards[1].value &&
      balance >= hand.bet
    );
  }

  function resetButtons() {
    btnHit.disabled = true;
    btnStand.disabled = true;
    btnDouble.disabled = true;
    btnSplit.disabled = true;
    btnDeal.disabled = bet === 0;
    btnNew.disabled = true;
    chipButtons.forEach((c) => (c.style.pointerEvents = ""));
    btnClearBet.disabled = false;
  }

  function dealCards() {
    if (bet === 0) return;

    createDeck();
    shuffleDeck();

    playerHands = [
      {
        cards: [drawCard(), drawCard()],
        bet: bet,
        doubled: false,
      },
    ];
    dealerHand = [drawCard(), drawCard()];

    currentHandIndex = 0;

    updateBalance();
    renderPlayerHands();
    renderCards(dealerCardsContainer, dealerHand, true);
    dealerScoreDisplay.textContent = "";

    message.textContent = "";

    btnHit.disabled = false;
    btnStand.disabled = false;
    btnDouble.disabled = false;
    btnSplit.disabled = !canSplit(playerHands[0]);
    btnDeal.disabled = true;

    chipButtons.forEach((c) => (c.style.pointerEvents = "none"));
    btnClearBet.disabled = true;
    btnNew.disabled = true;
  }

  function hit() {
    const handObj = playerHands[currentHandIndex];
    handObj.cards.push(drawCard());
    renderPlayerHands();

    if (calculateScore(handObj.cards) > 21) {
      message.textContent = `Hand ${currentHandIndex + 1} ist Bust!`;
      nextHandOrDealer();
    }
  }

  function stand() {
    nextHandOrDealer();
  }

  function doubleDown() {
    const handObj = playerHands[currentHandIndex];
    if (balance < handObj.bet) return;

    balance -= handObj.bet;
    handObj.bet *= 2;
    handObj.doubled = true;
    handObj.cards.push(drawCard());

    updateBalance();
    renderPlayerHands();

    if (calculateScore(handObj.cards) > 21) {
      message.textContent = `Hand ${currentHandIndex + 1} ist Bust!`;
    }
    nextHandOrDealer();
  }

  function split() {
    const handObj = playerHands[currentHandIndex];
    if (!canSplit(handObj)) return;

    const card1 = handObj.cards[0];
    const card2 = handObj.cards[1];

    if (balance < handObj.bet) {
      message.textContent = "Nicht genug Guthaben zum Split!";
      return;
    }

    balance -= handObj.bet;

    playerHands.splice(
      currentHandIndex,
      1,
      { cards: [card1, drawCard()], bet: handObj.bet, doubled: false },
      { cards: [card2, drawCard()], bet: handObj.bet, doubled: false }
    );

    updateBalance();
    renderPlayerHands();

    btnSplit.disabled = true;
    btnDouble.disabled = false;
  }

  function dealerPlay() {
    renderCards(dealerCardsContainer, dealerHand, false);

    let dealerScore = calculateScore(dealerHand);
    dealerScoreDisplay.textContent = `Punkte: ${dealerScore}`;

    while (dealerScore < 17) {
      dealerHand.push(drawCard());
      dealerScore = calculateScore(dealerHand);
      renderCards(dealerCardsContainer, dealerHand, false);
      dealerScoreDisplay.textContent = `Punkte: ${dealerScore}`;
    }
  }

  function nextHandOrDealer() {
    if (currentHandIndex < playerHands.length - 1) {
      currentHandIndex++;
      renderPlayerHands();
      btnSplit.disabled = !canSplit(playerHands[currentHandIndex]);
      btnDouble.disabled = !(
        !playerHands[currentHandIndex].doubled &&
        playerHands[currentHandIndex].cards.length === 2 &&
        balance >= playerHands[currentHandIndex].bet
      );
      btnHit.disabled = false;
      btnStand.disabled = false;
      message.textContent = `Hand ${currentHandIndex + 1} ist dran.`;
    } else {
      btnHit.disabled = true;
      btnStand.disabled = true;
      btnDouble.disabled = true;
      btnSplit.disabled = true;

      dealerPlay();
      determineOutcome();
      btnNew.disabled = false;
      message.textContent += " Spiel beendet.";
    }
  }

  function determineOutcome() {
    const dealerScore = calculateScore(dealerHand);

    playerHands.forEach((handObj, idx) => {
      const playerScore = calculateScore(handObj.cards);

      if (playerScore > 21) {
        message.textContent += ` Hand ${idx + 1} verliert (Bust).`;
      } else if (dealerScore > 21) {
        message.textContent += ` Hand ${idx + 1} gewinnt (Dealer Bust).`;
        balance += handObj.bet * 2;
      } else if (playerScore > dealerScore) {
        message.textContent += ` Hand ${idx + 1} gewinnt!`;
        balance += handObj.bet * 2;
      } else if (playerScore === dealerScore) {
        message.textContent += ` Hand ${idx + 1} unentschieden.`;
        balance += handObj.bet;
      } else {
        message.textContent += ` Hand ${idx + 1} verliert.`;
      }
    });

    updateBalance();
  }

  btnDeal.addEventListener("click", dealCards);
  btnHit.addEventListener("click", hit);
  btnStand.addEventListener("click", stand);
  btnDouble.addEventListener("click", doubleDown);
  btnSplit.addEventListener("click", split);
  btnNew.addEventListener("click", () => {
    bet = 0;
    balanceDisplay.textContent = `Guthaben: ${balance} €`;
    betDisplay.textContent = `Einsatz: ${bet} €`;
    dealerCardsContainer.innerHTML = "";
    dealerScoreDisplay.textContent = "";
    playerHandsContainer.innerHTML = "";
    message.textContent = "";
    resetButtons();
  });

  document.getElementById('place-bet').addEventListener('click', function() {
    const betError = document.getElementById('bet-error');
    betError.textContent = '';
    let betType = document.getElementById('bet-type').value;
    let betValue = parseInt(document.getElementById('bet-amount-input').value, 10);

    if (isNaN(betValue) || betValue < 1) {
        betError.textContent = 'Der Einsatz muss mindestens 1€ betragen!';
        return;
    }
    if (betValue > balance) {
        betError.textContent = 'Sie können nicht mehr setzen, als Sie haben!';
        return;
    }

    if (betType === 'number') {
        let betInput = parseInt(document.getElementById('bet-number-input').value, 10);
        if (isNaN(betInput) || betInput < 0 || betInput > 36) {
            betError.textContent = 'Bitte geben Sie eine gültige Zahl zwischen 0 und 36 ein.';
            return;
        }
        betNumber = betInput;
        betColor = '';
    } else {
        betColor = document.getElementById('bet-color-input').value;
        betNumber = '';
    }
    currentBet = betValue;
    balance -= betValue;
    updateBalance();
});

  updateBalance();
  resetButtons();
})();

document.getElementById('btn-return').addEventListener('click', () => {
  window.location.href = '/../Home/Casino/indexofCasino.html';
});