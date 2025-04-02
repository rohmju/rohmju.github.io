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
    alert("Game started!");
}

function visible() {
    selectedwindow = true;
    const elements = document.getElementsByClassName("Difficulty");
    for (const element of elements) {
        element.style.visibility = "visible"; // Make buttons visible
        element.style.display = "inline-block"; // Ensure they are displayed
    }
}

function getthisclasshidden(ClassName) {
    selectedwindow = false;
    const elements = document.getElementsByClassName(ClassName);
    for (const element of elements) {
        element.style.visibility = "hidden"; // Hide buttons
        element.style.display = "none"; // Ensure they are not displayed
    }
}

function youneverseemeagain(clickedElement) {
    const content = clickedElement.textContent;
    const chooserbutton = document.getElementById("Difficultyslider");
    chooserbutton.innerText = content; // Update button text
    choosen = true;
    getthisclasshidden("Difficulty"); // Hide difficulty options
}

// Attach functions to the global `window` object
window.start = start;
window.visible = visible;
window.getthisclasshidden = getthisclasshidden;
window.youneverseemeagain = youneverseemeagain;

// Import the GoogleGenAI library
import { GoogleGenAI } from 'https://cdn.jsdelivr.net/npm/@google/genai@latest/+esm';

async function initializeAI() {
    try {
        // HARDCODED API KEY (nur für Tests)
        const apiKey = "AIzaSyBuKIDaFpVt4sMEtU8FOuZL2H7GiiluB1g"; // Ersetze dies durch deinen API-Schlüssel

        // Initialisiere die GoogleGenAI-Bibliothek
        const ai = new GoogleGenAI({ apiKey });

        // Sende eine Anfrage an das Modell
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: "Explain how AI works",
        });

        // Logge die Antwort
        console.log(response.text);
    } catch (error) {
        console.error("Error initializing AI or generating content:", error);
    }
}

initializeAI();