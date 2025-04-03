let choosen = false;
let selectedwindow = false;

function switchtotrue() {
    choosen = true;
}

function start() {
    if (!choosen) {
        alert("Please choose a difficulty first!");
        return;
    }

    const difficultySlider = document.getElementById("Difficultyslider");
    if (!difficultySlider) {
        alert("Difficulty slider not found!");
        return;
    }

    const difficulty = difficultySlider.innerText; // Hole die Schwierigkeit
    if (!difficulty) {
        alert("Please select a difficulty!");
        return;
    }

    // Clear the screen and start the game
    const gameContainer = document.body;
    gameContainer.innerHTML = `
        <div id="hangman-container">
            <h1>Hangman</h1>
            <div id="hangman-drawing"></div>
            <div id="word-container"></div>
            <div id="input-container">
                <input type="text" id="letter-input" maxlength="1" placeholder="Enter a letter" />
                <button id="submit-letter">Submit</button>
            </div>
            <div id="attempts-container"></div>
            <button id="restart-game" onclick="location.reload()">Restart Game</button>
        </div>
    `;

    game(difficulty);
}

function visible() {
    selectedwindow = true;
    const elements = document.getElementsByClassName("Difficulty");
    for (const element of elements) {
        element.style.visibility = "visible";
        element.style.display = "inline-block";
    }

    // Dynamisch den Difficulty-Slider erstellen, falls er fehlt
    if (!document.getElementById("Difficultyslider")) {
        const difficultySlider = document.createElement("button");
        difficultySlider.id = "Difficultyslider";
        difficultySlider.innerText = "Easy"; // Standardwert
        document.body.appendChild(difficultySlider);
    }
}

function getthisclasshidden(ClassName) {
    selectedwindow = false;
    const elements = document.getElementsByClassName(ClassName);
    for (const element of elements) {
        element.style.visibility = "hidden";
        element.style.display = "none";
    }
}

function youneverseemeagain(clickedElement) {
    const content = clickedElement.textContent;
    const chooserbutton = document.getElementById("Difficultyslider");
    chooserbutton.innerText = content;
    choosen = true;
    getthisclasshidden("Difficulty");
}

window.start = start;
window.visible = visible;
window.getthisclasshidden = getthisclasshidden;
window.youneverseemeagain = youneverseemeagain;

import { GoogleGenAI } from './libs/genai/dist/web/index.mjs';

async function initializeAI(difficulty) {
    try {
        const apiKey = "AIzaSyBuKIDaFpVt4sMEtU8FOuZL2H7GiiluB1g";
        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `I want you to generate a word from 4 possible difficulties: easy, medium, hard, and impossible. The word should be 4 letters long for easy, 6 letters long for medium, 8 letters long for hard, and 10 letters long for impossible. The word should be a noun. The word should not contain any special characters or numbers. The word should be in German. Your output only should be 1 word. Like if I tell you "easy" you only respond "Biene". The difficulty level is: ${difficulty}. Remember to only respond with the word and nothing else.`,
        });

        const generatedWord = response.text.trim();
        return generatedWord;
    } catch (error) {
        console.error("Error initializing AI or generating content:", error);
    }
}

async function game(difficulty) {
    const word = await initializeAI(difficulty); // Das generierte Wort
    const maxAttempts = 6; // Maximale Anzahl an Versuchen
    let attemptsLeft = maxAttempts;
    let guessedLetters = new Set(); // Set für bereits geratene Buchstaben
    const wordContainer = document.getElementById("word-container");
    const attemptsContainer = document.getElementById("attempts-container");
    const hangmanDrawing = document.getElementById("hangman-drawing");
    const alphabetContainer = document.createElement("div");
    alphabetContainer.id = "alphabet-container";
    document.getElementById("hangman-container").appendChild(alphabetContainer);

    // Funktion zum Erstellen des Buchstaben-Panels
    function createAlphabetPanel() {
        const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
        alphabetContainer.innerHTML = ""; // Leere das Panel
        alphabet.forEach((letter) => {
            const letterButton = document.createElement("button");
            letterButton.textContent = letter.toUpperCase();
            letterButton.className = "letter-button";
            letterButton.addEventListener("click", () => handleLetterClick(letter, letterButton));
            alphabetContainer.appendChild(letterButton);
        });
    }

    // Funktion zum Aktualisieren der Wortanzeige
    function updateWordDisplay() {
        wordContainer.innerHTML = ""; // Leere den Container
        for (const letter of word) {
            const letterElement = document.createElement("span");
            letterElement.textContent = guessedLetters.has(letter) ? letter : "_"; // Zeige Buchstaben oder Unterstrich
            letterElement.className = "word-letter"; // CSS-Klasse für Styling
            wordContainer.appendChild(letterElement);
        }
    }

    // Funktion zum Aktualisieren der Versuche-Anzeige
    function updateAttemptsDisplay() {
        attemptsContainer.textContent = `Attempts left: ${attemptsLeft}`;
    }

    // Funktion zum Zeichnen des Hangman-Diagramms
    function drawHangman() {
        hangmanDrawing.innerHTML = ""; // Leere das Hangman-Diagramm
        const stages = [
            "Head",
            "Body",
            "Left Arm",
            "Right Arm",
            "Left Leg",
            "Right Leg",
        ];
        for (let i = 0; i < maxAttempts - attemptsLeft; i++) {
            const part = document.createElement("div");
            part.textContent = stages[i];
            part.className = "hangman-part"; // CSS-Klasse für Styling
            hangmanDrawing.appendChild(part);
        }
    }

    // Funktion zum Verarbeiten eines Buchstaben-Klicks
    function handleLetterClick(letter, button) {
        const lowerCaseLetter = letter.toLowerCase(); // Konvertiere den Buchstaben in Kleinbuchstaben

        if (guessedLetters.has(lowerCaseLetter)) return; // Ignoriere bereits geratene Buchstaben

        guessedLetters.add(lowerCaseLetter); // Füge den Buchstaben zu den geratenen hinzu
        button.disabled = true; // Deaktiviere den Button
        button.classList.add("disabled-button"); // Füge eine CSS-Klasse für deaktivierte Buttons hinzu

        if (!word.includes(lowerCaseLetter)) {
            attemptsLeft--; // Reduziere die verbleibenden Versuche
            drawHangman(); // Aktualisiere das Hangman-Diagramm
        }

        updateWordDisplay(); // Aktualisiere die Wortanzeige
        updateAttemptsDisplay(); // Aktualisiere die Versuche-Anzeige

        // Überprüfe, ob das Spiel vorbei ist
        if (attemptsLeft === 0) {
            alert(`Game over! The word was: ${word}`);
            location.reload(); // Lade die Seite neu
        } else if (Array.from(word).every((letter) => guessedLetters.has(letter.toLowerCase()))) {
            alert("Congratulations! You guessed the word!");
            location.reload(); // Lade die Seite neu
        }
    }

    // Initialisiere die Anzeige
    createAlphabetPanel();
    updateWordDisplay();
    updateAttemptsDisplay();
}