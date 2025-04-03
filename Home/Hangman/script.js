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
    const difficulty = document.getElementById("Difficultyslider").innerText; // Get the selected difficulty
    initializeAI(difficulty); // Pass the difficulty to the AI function
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
    chooserbutton.innerText = content; // Update button text with the selected difficulty
    choosen = true;
    getthisclasshidden("Difficulty"); // Hide difficulty options
}

// Attach functions to the global `window` object
window.start = start;
window.visible = visible;
window.getthisclasshidden = getthisclasshidden;
window.youneverseemeagain = youneverseemeagain;

// Import the GoogleGenAI library
import { GoogleGenAI } from './libs/genai/dist/web/index.mjs';

async function initializeAI(difficulty) {
    try {
        // HARDCODED API KEY (for testing purposes only)
        const apiKey = "AIzaSyBuKIDaFpVt4sMEtU8FOuZL2H7GiiluB1g";

        // Initialize the GoogleGenAI library
        const ai = new GoogleGenAI({ apiKey });

        // Send a request to the model
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `I want you to generate a word from 4 possible difficulties: easy, medium, hard, and impossible. The word should be 4 letters long for easy, 6 letters long for medium, 8 letters long for hard, and 10 letters long for impossible. The word should be a noun. The word should not contain any special characters or numbers. The word should be in German. Your output only should be 1 word. Like if I tell you "easy" you only respond "Biene". The difficulty level is: ${difficulty}. Remember to only respond with the word and nothing else.`,
        });

        // Extract and clean the response
        const generatedWord = response.text.trim(); // Ensure only the word is returned

        // Log the cleaned response
        

    } catch (error) {
        console.error("Error initializing AI or generating content:", error);
    }
}