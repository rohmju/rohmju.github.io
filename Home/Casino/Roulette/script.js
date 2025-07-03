const n = 37;
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
container.appendChild(kugel); // Kugel unabhängig vom Wheel

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

    // Move triangle outside the ball circle slightly
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
});
setTimeout(() => {
    kugelAngle = 0;
    positionKugel(kugelAngle);
}, 0);

if (wheel && spinbutton) {
    spinbutton.addEventListener('click', () => {
        // Zufällige Zielzahl bestimmen
        const ziel = Math.floor(Math.random() * n);

        // Berechne den Zielwinkel für das Wheel (so dass die Zielzahl oben steht)
        lastAngle = -((3600 / n) * ziel);

        // Animation für das Wheel
        wheel.style.transition = 'transform 8s cubic-bezier(0.25, 0.1, 0.25, 1)';
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
            console.log('Kugel liegt auf:', result.number, 'Farbe:', result.color);

            spinbutton.textContent = 'Spin';
            spinbutton.disabled = false;
        }, 2000);
    });
}

// Korrekte Auslesefunktion (immer oben ist die gezogene Zahl)
function getCurrentButtonAndColor() {
    // Die Zahl, auf der die Kugel liegt, ist die gezogene Zielzahl
    // Da das Wheel so gedreht wird, dass sie oben ist, ist das immer 0° (kugelAngle = 0)
    // Finde den Button, der aktuell oben ist:
    let ziel = Math.round(((-lastAngle) / (360 / n))) % n;
    if (ziel < 0) ziel += n;
    const btn = document.getElementById(`btn-${ziel}`);
    let color = '';
    if (btn) {
        color = window.getComputedStyle(btn).backgroundColor;
    }
    return { number: ziel, color, btn };
}