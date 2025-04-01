var choosen = false;
var selectedwindow = false;
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
function getthisclassvisible() {
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