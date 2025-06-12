const n = 37;
const radius = 300;
const container = document.querySelector('.circle-container');

// Remove existing buttons if any
container.innerHTML = '';

// Dynamically create and append 37 buttons
for (let i = 0; i < n; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    container.appendChild(btn);
    btn.id = `btn-${i}`;
}

// After appending, select all buttons
const buttons = container.querySelectorAll('button');
const centerX = container.offsetWidth / 2;
const centerY = container.offsetHeight / 2;

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