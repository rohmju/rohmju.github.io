function openYT() {
    const body = document.querySelector('html');
    body.innerHTML = '';
    const iframe = document.createElement('iframe'); 
    const returnbutton = document.createElement('button');
    iframe.src = 'https://www.youtube.com/embed/0i1sbW26-K8?autoplay=1&loop=1&playlist=0i1sbW26-K8&mute=1';
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.zIndex = '-1'; 
    returnbutton.innerText = 'Return';
    returnbutton.style.position = 'fixed';
    returnbutton.style.top = '10px';
    returnbutton.style.left = '10px';
    returnbutton.style.zIndex = '1';
    returnbutton.setAttribute('id', 'returnbutton',
    );
    returnbutton.addEventListener('mouseover', () => {moving(returnbutton)});
    
        
    returnbutton.addEventListener('click', () => {
        window.location.reload();
    });
    body.appendChild(iframe);
    body.appendChild(returnbutton);
}
function openCat() {
    const body = document.querySelector('body');
    body.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/0i1sbW26-K8?autoplay=1&loop=1&playlist=0i1sbW26-K8&mute=1';
    const returnbutton = document.createElement('button');
    returnbutton.innerText = 'Return';
    returnbutton.addEventListener('click', () => {
        window.location.reload();
    });

    body.appendChild(iframe);
    body.appendChild(returnbutton);
}
function moving(returnbutton) {
    returnbutton.style.left = "6000px";
    returnbutton.style.backgroundImage = 'url("./plane.png")'; 
    returnbutton.style.backgroundColor = 'transparent';          
    returnbutton.style.border = 'none';
    returnbutton.style.height = '180px';
    returnbutton.style.width = '180px';
    returnbutton.innerText = '';
    returnbutton.style.backgroundSize = '180px 180px';
    returnbutton.style.transition = 'left 4s';
    returnbutton.style.transitionDelay = '1s';
    setTimeout(() => {
        returnbutton.style.color = 'red';
    }, 1000);
}
