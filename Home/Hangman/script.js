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
    const difficulty = document.getElementById("Difficultyslider").innerText; 
    initializeAI(difficulty);
    alert("Game started!");
}

function visible() {
    selectedwindow = true;
    const elements = document.getElementsByClassName("Difficulty");
    for (const element of elements) {
        element.style.visibility = "visible"; 
        element.style.display = "inline-block"; 
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
        // HARDCODED API KEY (for testing purposes only)
        const apiKey = "AIzaSyBuKIDaFpVt4sMEtU8FOuZL2H7GiiluB1g";


        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `I want you to generate a word from 4 possible difficulties: easy, medium, hard, and impossible. The word should be 4 letters long for easy, 6 letters long for medium, 8 letters long for hard, and 10 letters long for impossible. The word should be a noun. The word should not contain any special characters or numbers. The word should be in German. Your output only should be 1 word. Like if I tell you "easy" you only respond "Biene". The difficulty level is: ${difficulty}. Remember to only respond with the word and nothing else.`,
        });


        const generatedWord = response.text.trim(); 

        

    } catch (error) {
        console.error("Error initializing AI or generating content:", error);
    }
}