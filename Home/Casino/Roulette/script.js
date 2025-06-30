const n = 37;
const container = document.querySelector('.circle-container');

container.innerHTML = '';

const wheel = document.createElement('div');
wheel.className = 'wheel';
container.appendChild(wheel);

const inner = document.createElement('div');
inner.className = 'inner-circle';
container.appendChild(inner);
const dreieck = document.createElement('div');
dreieck.className = 'dreieck';
document.body.appendChild(dreieck);

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
const wheelRect = container.getBoundingClientRect();
const centerX = wheel.offsetWidth / 2;
const centerY = wheel.offsetHeight / 2;
const btnSize = 48;
const innerCircleSize = 320;
const outerRadius = (wheel.offsetWidth - innerCircleSize) / 2 + innerCircleSize / 2 - btnSize / 2;

buttons.forEach((btn, i) => {
    const angleRad = (2 * Math.PI / n) * i - Math.PI / 2;
    const angleDeg = (360 / n) * i;

    const x = centerX + outerRadius * Math.cos(angleRad) - btnSize / 2;
    const y = centerY + outerRadius * Math.sin(angleRad) - btnSize / 2;

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

if (wheel && spinbutton) {
    spinbutton.addEventListener('click', () => {
        const randomDelta = Math.floor(Math.random() * 2000) + 920;
        lastAngle += randomDelta;
        wheel.style.transition = 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)';
        wheel.style.transform = `rotate(${lastAngle}deg)`;
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