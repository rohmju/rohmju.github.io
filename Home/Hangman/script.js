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

// Function to fetch and log data from a local file
async function fetchLocalFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        return data; // Return the fetched data
    } catch (error) {
        console.error("Error fetching the file:", error);
    }
}

// Import the GoogleGenAI library
import { GoogleGenAI } from './libs/genai/dist/web/index.mjs';

async function initializeAI() {
    try {
        // Lade den API-Schlüssel aus der Datei
        const apiKey = await fetchLocalFile('key.txt');
        if (!apiKey) {
            console.error("Failed to fetch API key.");
            return;
        }

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