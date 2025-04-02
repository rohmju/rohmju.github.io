var choosen = false;
var selectedwindow = false;
import { GoogleGenAI } from "@google/genai";
// Removed 'fs' import as it is not supported in browser environments
function switchtotrue() {
    
    choosen = true;
}

function start() {
    if (!choosen) {
        alert("Please choose a difficulty first!");
        return;
    }
    if (choosen){
        alert("Game started!")
    }

}
function visible() {
    selectedwindow = true;
    let elements = document.getElementsByClassName("Difficulty");
    for (let element of elements) {
        element.style.visibility = "visible";
    }
}
function getthisclasshidden(ClassName) {
    selectedwindow = false;
    let elements = document.getElementsByClassName(`${ClassName}`);
    for (let element of elements) {
        element.style.visibility = "hidden";
    }
}

function youneverseemeagain(clickedElement){
    var content = clickedElement.textContent;
    chooserbutton = document.getElementById("Difficultyslider");
    chooserbutton.innerText = content;
    choosen = true;
    getthisclasshidden("Difficulty");
}



// Removed 'fs' usage as it is not supported in browser environments

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Explain how AI works",
  });
  console.log(response.text);
}

