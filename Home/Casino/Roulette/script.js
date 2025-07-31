const n = 37;
let money = 0;
let username = "";
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabaseUrl = "https://whanfrajisrghcsktdyv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoYW5mcmFqaXNyZ2hjc2t0ZHl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTg4NDA5NiwiZXhwIjoyMDY3NDYwMDk2fQ.B84xlTaviNSb4tGRVbIoAL6KlvEOQVYAm8PXqyPv6q8"
const supabase = createClient(supabaseUrl, supabaseKey)
const cookie = document.cookie.split('; ').find(c => c.startsWith('userInfo='));
username = cookie ? (cookie.split('=')[1] || '').split('|')[0] : '';
console.log('Username:', username);

if (cookie) {
    const [prefix, value] = cookie.split('=');
    const [label, amount] = (value || '').split('|');

    if (label === 'test' && Number.isInteger(Number(amount))) {
        money = Number(amount);
    }
}
let currentBet = 0;
let betNumber = '';
let betColor = '';

function updateMoneyUI() {
    document.getElementById('money-amount').textContent = money;
    document.getElementById('bet-number').textContent = betNumber !== '' ? betNumber : '-';
    document.getElementById('bet-color').textContent = betColor !== '' ? betColor : '-';
    document.getElementById('bet-amount-input').max = money;
}

const container = document.querySelector('.circle-container');
container.innerHTML = '';

const wheel = document.createElement('div');
wheel.className = 'wheel';
container.appendChild(wheel);

const inner = document.createElement('div');
inner.className = 'inner-circle';
container.appendChild(inner);

const kugel = document.createElement('div');
kugel.className = 'dreieck';
container.appendChild(kugel); // Zeiger unabhängig vom Wheel

for (let i = 0; i < n; i++) {
    const btn = document.createElement('button');
    btn.className = 'roulette-ball';
    btn.id = `btn-${i}`;
    const label = document.createElement('span');
    label.className = 'number-label';
    label.textContent = i;
    btn.appendChild(label);
    wheel.appendChild(btn);
}

const buttons = wheel.querySelectorAll('.roulette-ball');
const wheelSize = wheel.offsetWidth;
const centerX = wheelSize / 2;
const centerY = wheelSize / 2;
const btnSize = 48;
const borderWidth = 8;
const radius = (wheelSize / 2) - (btnSize / 2) - borderWidth;

buttons.forEach((btn, i) => {
    const angleRad = (2 * Math.PI / n) * i - Math.PI / 2;
    const angleDeg = (360 / n) * i;
    const x = centerX + radius * Math.cos(angleRad) - btnSize / 2;
    const y = centerY + radius * Math.sin(angleRad) - btnSize / 2;
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
    btn.style.transform = `rotate(${angleDeg}deg)`;
    btn.style.setProperty('--angle', `${angleDeg}deg`);
    const num = i;
    if (num === 0) {
        btn.style.backgroundColor = 'green';
    } else if (num % 2 === 0) {
        btn.style.backgroundColor = 'black';
    } else {
        btn.style.backgroundColor = 'red';
    }
});

const spinbutton = document.getElementById('spin-button');
let lastAngle = 0;
let kugelAngle = 0;

// --- Kugel immer exakt mittig auf Button platzieren ---
function positionKugel(angleDeg) {
    const kugelSize = kugel.offsetWidth;
    const extraOffset = 18; // tweak this as needed to sit just above the rim
    const kugelRadius = radius + extraOffset;
    const angleRad = (angleDeg - 90) * Math.PI / 180;
    const x = centerX + kugelRadius * Math.cos(angleRad) - kugelSize / 2;
    const y = centerY + kugelRadius * Math.sin(angleRad) - kugelSize / 2;
    kugel.style.left = `${x}px`;
    kugel.style.top = `${y}px`;
}

// --- Kugel startet immer auf der 0 ---
window.addEventListener('resize', () => {
    positionKugel(kugelAngle);
});
window.addEventListener('DOMContentLoaded', () => {
    kugelAngle = 0; // Start auf 0
    positionKugel(kugelAngle);
    updateMoneyUI();
});
setTimeout(() => {
    kugelAngle = 0;
    positionKugel(kugelAngle);
}, 0);

// Einsatz setzen
const placeBetBtn = document.getElementById('place-bet');
placeBetBtn.addEventListener('click', function() {
    const betError = document.getElementById('bet-error');
    betError.textContent = '';
    let betType = document.getElementById('bet-type').value;
    let betValue = parseInt(document.getElementById('bet-amount-input').value, 10);

    if (placeBetBtn.disabled) return; // Doppelklick verhindern

    if (isNaN(betValue) || betValue < 1) {
        betError.textContent = 'Bet must be at least 1€!';
        return;
    }
    if (betValue > money) {
        betError.textContent = 'You cannot bet more than you have!';
        return;
    }

    if (betType === 'number') {
        let betInput = parseInt(document.getElementById('bet-number-input').value, 10);
        if (isNaN(betInput) || betInput < 0 || betInput > 36) {
            betError.textContent = 'Please enter a valid number between 0 and 36.';
            return;
        }
        betNumber = betInput;
        betColor = '';
    } else {
        betColor = document.getElementById('bet-color-input').value;
        betNumber = '';
    }
    currentBet = betValue;
    money -= betValue;

    // Update cookie on bet
    updateCookieMoney(money);

    updateMoneyUI();
    placeBetBtn.disabled = true; // Nach Einsatz setzen deaktivieren
});

if (wheel && spinbutton) {
    spinbutton.addEventListener('click', () => {
        if (currentBet === 0) {
            alert('Bitte zuerst Einsatz platzieren!');
            return;
        }
        // Zufällige Zielzahl bestimmen
        const ziel = Math.floor(Math.random() * n);

        // Berechne den Zielwinkel für das Wheel (so dass die Zielzahl oben steht)
        lastAngle = -((3600 / n) * ziel) + 5 * 360; // 5 Umdrehungen für Animation

        // Animation für das Wheel
        wheel.style.transition = 'transform 2s cubic-bezier(0.25, 0.1, 0.25, 1)';
        wheel.style.transform = `rotate(${lastAngle}deg)`;

        // Kugel bleibt oben (keine Animation nötig, aber für Konsistenz mitgeben)
        kugel.style.transition = 'left 2s cubic-bezier(0.25, 0.1, 0.25, 1), top 2s cubic-bezier(0.25, 0.1, 0.25, 1)';
        kugelAngle = 0;
        positionKugel(kugelAngle);

        spinbutton.textContent = 'Spinning...';
        spinbutton.disabled = true;

        setTimeout(() => {
            // Button und Farbe auslesen
            const result = getCurrentButtonAndColor();
            handleSpinResult(result);
            spinbutton.textContent = 'Spin';
            spinbutton.disabled = false;
            placeBetBtn.disabled = false; // Einsatz wieder erlauben nach Runde
        }, 2000);
    });
}

// Korrekte Auslesefunktion (immer oben ist die gezogene Zahl)
function getCurrentButtonAndColor() {
    let ziel = Math.round(((-lastAngle) / (360 / n))) % n;
    if (ziel < 0) ziel += n;
    const btn = document.getElementById(`btn-${ziel}`);
    let color = '';
    if (btn) {
        color = window.getComputedStyle(btn).backgroundColor;
    }
    return { number: ziel, color, btn };
}

// Bet-Auswahl umschalten
const betType = document.getElementById('bet-type');
const numberChoice = document.getElementById('bet-number-choice');
const colorChoice = document.getElementById('bet-color-choice');
betType.addEventListener('change', function() {
    if (this.value === 'number') {
        numberChoice.style.display = '';
        colorChoice.style.display = 'none';
    } else {
        numberChoice.style.display = 'none';
        colorChoice.style.display = '';
    }
});

// Helper to update cookie money
function updateCookieMoney(newMoney) {
    const newCookieValue = `test|${newMoney}`;
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    document.cookie = `userInfo=${newCookieValue}; path=/; expires=${expires.toUTCString()}`;
}

async function handleSpinResult(result) {
    let win = false;
    if (betNumber !== '' && result.number == betNumber) {
        money += currentBet * 36;
        win = true;
    } else if (betColor && (
        (betColor === 'Red' && result.color === 'rgb(255, 0, 0)') ||
        (betColor === 'Black' && result.color === 'rgb(0, 0, 0)')
    )) {
        money += currentBet * 2;
        win = true;
    }

    // Always update database regardless of win/loss
    const { data, error } = await supabase
        .from('stonks')
        .update({ money: money })
        .eq('username', username)
        .select();

    if (error) {
        console.error('Database update error:', error);
    }

    updateCookieMoney(money);
    alert(win ? 'You win!' : 'You lose!');

    currentBet = 0;
    updateMoneyUI();
}

