document.querySelector('#startGameButton').addEventListener('click', function() {
    // Leert den Inhalt der Seite
    const gameQuestionDiv = document.querySelector('body');
    gameQuestionDiv.innerHTML = '';
    let i = 0;
    // Fügt neue Elemente hinzu

    let newElement = document.createElement('p');
    let newElement2 = document.createElement('p');
    let newbutton = document.createElement('button');
    let newdiv = document.createElement('div');
    newdiv.className = 'dermarabu';
    newElement.className = 'smtcool';
    newbutton.className = 'smtcooler';
    newElement.textContent = 'Dies ist der neue Inhalt der Seite.';
    newElement2.textContent = 'Dies ist ein weiteres neues Element.';
    newbutton.textContent = '???';
    gameQuestionDiv.appendChild(newdiv);
    gameQuestionDiv.appendChild(newElement);
    gameQuestionDiv.appendChild(newElement2);
    newdiv.appendChild(newbutton);
    while (i < 10) {
        let button = document.createElement('button');
        button.textContent = '1';
        button.id = 'button' + i; 
        newdiv.appendChild(button);
        button.addEventListener('click', function() {
            alert('Button ' + i + ' clicked!');
        });
        i = i + 1;
    }
});
console,log('');