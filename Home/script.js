function openYouTubeVideo() {
    const htmlBody = document.querySelector('html');
    htmlBody.innerHTML = '';
    const videoIframe = document.createElement('iframe'); 
    const returnButton = document.createElement('button');
    videoIframe.src = 'https://www.youtube.com/embed/0i1sbW26-K8?autoplay=1&loop=1&playlist=0i1sbW26-K8&mute=1';
    videoIframe.style.position = 'fixed';
    videoIframe.style.top = '0';
    videoIframe.style.left = '0';
    videoIframe.style.width = '100%';
    videoIframe.style.height = '100%';
    videoIframe.style.border = 'none';
    videoIframe.style.zIndex = '-1'; 
    returnButton.innerText = 'Return';
    returnButton.style.position = 'fixed';
    returnButton.style.top = '10px';
    returnButton.style.left = '10px';
    returnButton.style.zIndex = '1';
    returnButton.setAttribute('id', 'returnButton');
    returnButton.addEventListener('mouseover', () => {animateReturnButton(returnButton)});
    returnButton.addEventListener('click', () => {
        window.location.reload();
    });
    htmlBody.appendChild(videoIframe);
    htmlBody.appendChild(returnButton);
}

function openCatVideo() {
    const htmlBody = document.querySelector('body');
    htmlBody.innerHTML = '';
    const videoIframe = document.createElement('iframe');
    videoIframe.src = 'https://www.youtube.com/embed/0i1sbW26-K8?autoplay=1&loop=1&playlist=0i1sbW26-K8&mute=1';
    const returnButton = document.createElement('button');
    returnButton.innerText = 'Return';
    returnButton.addEventListener('click', () => {
        window.location.reload();
    });

    htmlBody.appendChild(videoIframe);
    htmlBody.appendChild(returnButton);
}

function animateReturnButton(returnButton) {
    returnButton.style.left = "6000px";
    returnButton.style.backgroundImage = 'url("./plane.png")'; 
    returnButton.style.backgroundColor = 'transparent';          
    returnButton.style.border = 'none';
    returnButton.style.height = '180px';
    returnButton.style.width = '180px';
    returnButton.innerText = '';
    returnButton.style.backgroundSize = '180px 180px';
    returnButton.style.transition = 'left 4s';
    returnButton.style.transitionDelay = '1s';
    setTimeout(() => {
        returnButton.style.color = 'red';
    }, 1000);
}
