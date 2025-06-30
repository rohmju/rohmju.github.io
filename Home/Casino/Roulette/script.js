const n = 37;
const radius = 300;
const container = document.querySelector('.circle-container');

// Remove existing buttons if any
container.innerHTML = '';

for (let i = 0; i < n; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    container.appendChild(btn);
    btn.id = `btn-${i}`;
}

const buttons = container.querySelectorAll('button');
const centerX = container.offsetWidth / 2;
const centerY = container.offsetHeight / 2;

// Set initial right and transition for smooth animation
container.style.right = '0px';
container.style.left = '0px';
container.style.transition = 'right 2s ease, transform 5s ease-out, left 2s';

buttons.forEach((btn, i) => {
    const angle = (2 * Math.PI / n) * i - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle) - btn.offsetWidth / 2;
    const y = centerY + radius * Math.sin(angle) - btn.offsetHeight / 2;
    btn.style.position = 'absolute';
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
});
buttons.forEach(btn => {
    
    const num = parseInt(btn.id.replace('btn-', ''));
    console.log (num);
    
    if (divv(num) === true) {
        btn.style.backgroundColor = 'black';
    }
    else if (divv(num) === false){
        btn.style.backgroundColor = 'red';
    }
    if (num === 0) {
        btn.style.backgroundColor = 'green';
    }
});


function divv(zahl) {
    zahl = parseInt(zahl);
    return zahl % 2 === 0;
}
const spinContainer = document.querySelector('.circle-container-butfortheonedumbbutton');
const spinbutton = document.createElement('button');
spinbutton.textContent = 'Spin';
spinbutton.id = 'spin-button';

let lastAngle = 0;

if (spinContainer) {
    spinContainer.appendChild(spinbutton);

    spinbutton.addEventListener('click', () => {
        // Generate a new random angle, add to lastAngle for cumulative rotation
        const randomDelta = Math.floor(Math.random() * 360) + 920; // at least 2 full spins
        lastAngle += randomDelta;
        container.style.transition = 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)';
        container.style.transform = `rotate(${lastAngle}deg)`;
    });
}
