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
    // Kugel exakt wie Buttons auf dem Kreis platzieren!
    const kugelSize = kugel.offsetWidth;
    // Korrigierter Radius: Buttons und Kugel müssen exakt denselben Mittelpunkt und Kreis nutzen!
    // Wenn Kugel kleiner als Button: Radius leicht erhöhen, damit sie mittig sitzt
    const kugelRadius = radius + (btnSize - kugelSize) / 2;
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
        // Zufällige Zielzahl
        const ziel = Math.floor(Math.random() * n);
        // Rad dreht wie gehabt
        const randomDelta = Math.floor(Math.random() * 2000) + 920;
        lastAngle += randomDelta;
        wheel.style.transition = 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)';
        wheel.style.transform = `rotate(${lastAngle}deg)`;

        // Kugel landet immer relativ zum aktuellen Radwinkel auf dem Ziel
        kugelAngle = (360 / n) * ziel - (lastAngle % 360);
        kugel.style.transition = 'left 5s cubic-bezier(0.25, 0.1, 0.25, 1), top 5s cubic-bezier(0.25, 0.1, 0.25, 1)';
        positionKugel(kugelAngle);

        spinbutton.textContent = 'Spinning...';
        spinbutton.disabled = true;
        setTimeout(() => {
            resetSpin();
        }, 5000);
    });
}

function resetSpin() {
    spinbutton.textContent = 'Spin';
    spinbutton.disabled = false;
}