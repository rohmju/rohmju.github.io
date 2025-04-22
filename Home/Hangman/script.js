let choosen = false;
let selectedwindow = false;
const Hintbutton = document.createElement("button");
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

    const difficulty = difficultySlider.innerText;
    if (!difficulty) {
        alert("Please select a difficulty!");
        return;
    }

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

    if (!document.getElementById("Difficultyslider")) {
        const difficultySlider = document.createElement("button");
        difficultySlider.id = "Difficultyslider";
        difficultySlider.innerText = "Easy";
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
        const apiKey = "AIzaSyBuKIDaFpVt" + "4sMEtU8FOuZL2H7GiiluB1g";
        if (!apiKey) {
            throw new Error("API key not found");
        }
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `I want you to generate a random word based on the following difficulty levels: easy, medium, hard, and impossible. The word should be a noun and commonly used in German, without any special characters or numbers. For easy, the word should be 4-5 letters long. For medium, the word should be 6-7 letters long. For hard, the word should be 8-9 letters long. For impossible, the word should be 15-40 letters long. The word should not repeat frequently and should not be in the previously generated list of words. If possible, consider synonyms to increase variety. Your output should be only 1 word, starting with a random letter of the alphabet that you choose. The difficulty level is: ${difficulty}. Use shortcuts like ue for ü and so on. Respond solely with the word and nothing else.`;


        const aiResponse = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
        
        const generatedWord = aiResponse.text.trim();
        return generatedWord;
    } catch (error) {
        console.error("Error initializing AI or generating content:", error);
        return null;
    }
}

async function game(difficulty) {
    const word = await initializeAI(difficulty);
    const maxAttempts = 6;
    let attemptsLeft = maxAttempts;
    let guessedLetters = new Set();
    const wordContainer = document.getElementById("word-container");
    const attemptsContainer = document.getElementById("attempts-container");
    const hangmanDrawing = document.getElementById("hangman-drawing");
    const alphabetContainer = document.createElement("div");
    alphabetContainer.id = "alphabet-container";
    document.getElementById("hangman-container").appendChild(alphabetContainer);

    function createAlphabetPanel() {
        const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
        alphabetContainer.innerHTML = "";
        alphabet.forEach((letter) => {
            const letterButton = document.createElement("button");
            letterButton.textContent = letter.toUpperCase();
            letterButton.className = "letter-button";
            letterButton.addEventListener("click", () => handleLetterClick(letter, letterButton));
            alphabetContainer.appendChild(letterButton);
        });
    }

    function updateWordDisplay() {
        wordContainer.innerHTML = "";
        for (const letter of word) {
            const letterElement = document.createElement("span");
            letterElement.textContent = guessedLetters.has(letter.toLowerCase()) ? letter : "_";
            letterElement.className = "word-letter";
            wordContainer.appendChild(letterElement);
        }
    }

    function updateAttemptsDisplay() {
        attemptsContainer.textContent = `Attempts left: ${attemptsLeft}`;
    }

    function drawHangman() {
        hangmanDrawing.innerHTML = "";
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
            part.className = "hangman-part";
            hangmanDrawing.appendChild(part);
        }
    }

    function handleLetterClick(letter, button) {
        const lowerCaseLetter = letter.toLowerCase();

        if (guessedLetters.has(lowerCaseLetter)) return;

        guessedLetters.add(lowerCaseLetter);
        button.disabled = true;
        button.classList.add("disabled-button");

        if (!word.toLowerCase().includes(lowerCaseLetter)) {
            attemptsLeft--;
            drawHangman();
        }

        updateWordDisplay();
        updateAttemptsDisplay();

        if (attemptsLeft === 0) {
            setTimeout(() => {
                alert(`Game over! The word was: ${word}`);
                location.reload();
            }, 500);
        } else if (Array.from(word.toLowerCase()).every((letter) => guessedLetters.has(letter.toLowerCase()))) {
            setTimeout(() => {
                alert(`Congratulations! You've guessed the word: ${word}`);
                location.reload();
            }, 500);
        }

    }
    async function createHelp_for_Dummies(){
        const helpbutton = document.createElement("button");
        document.getElementById("hangman-container").appendChild(helpbutton);

        helpbutton.textContent = "Hint";
        helpbutton.id = "Hintbutton";
        try {
            const apiKey = "AIzaSyBuKIDaFpVt" + "4sMEtU8FOuZL2H7GiiluB1g";
            if (!apiKey) {
                throw new Error("API key not found");
            }
    
            const ai2 = new GoogleGenAI({ apiKey });
        const prompt2 = `give me a hint for the word ${word} it should be related to the word. example: if the word is "fenster" you should response with: "Teil eines Hauses wo man durchschauen kann" and nothing else.`
        const aiResponse = await ai2.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt2,
    });
    helpbutton.addEventListener("click", () => {
        const hint = aiResponse.text.trim();
        alert(`Hint: ${hint}`); 
        document.getElementById("hangman-container").appendChild(helpbutton);
    });
} catch (error) {
    console.error("Error generating hint:", error);
}
    }

createAlphabetPanel();
    updateWordDisplay();
    updateAttemptsDisplay();
    createHelp_for_Dummies();

}