var choosen = false;4
var selectedwindow = false;
function switchtotrue() {
    choosen = true;
}

function start(choosen) {
    if (!choosen) {
        alert("Please choose a difficulty first!");
        return;
    }

}
function getthisclassvisible() {
    selectedwindow = true;
    let elements = document.getElementsByClassName("Difficulty");
    for (let element of elements) {
        element.style.visibility = "visible";
    }
}

function youneverseemeagain(clickedElement){
    var content = clickedElement.textContent;
    chooserbutton = document.getElementById("Difficultyslider");
    chooserbutton.innerText = content;
    choosen = true;
}