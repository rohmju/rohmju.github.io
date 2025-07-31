import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
// API-Key aufteilen und erst später zusammensetzen
const part1 = "23iujrq21eqd21e09qJKWOFLSA23WJFJa";
const part2 = "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoYW5mcmFqaXNyZ2hjc2t0ZHl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4ODQwOTYsImV4cCI6MjA2NzQ2MDA5Nn0.";
const part3 = "mgR_VSslwqLrvf9iE1IxRY9aUjYvSrxjUa-bfRlyRR8";
const supabaseKey = clearlog() + part2 + part3;
let clicked1 = false;
let clicked2 = false;
let mogging = false;
let stillgoing = true;
let username = "";
const divbutton = document.getElementById("signbuttons")
const supabaseUrl = "https://whanfrajisrghcsktdyv.supabase.co"
const supabase = createClient(supabaseUrl, supabaseKey)
let money = 0;
async function main() {
    permissionPopup();
    fetchdata();
    checkcookie();
    
    appearsignupButton();
    appearLoginButton();
    console.log('Casino page loaded');
    createloginbox();
    signup();
    
    const logoutBtn = document.getElementById("logout-button");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }

    
}

function appearsignupButton(){
    const signupButton = document.createElement("button");
    signupButton.className = "sign-up-button";
    signupButton.textContent = "sign up!"
    signupButton.onclick = () => {showsignup()};
    if(stillgoing == true)
        {signupButton.style.visibility = "visible"
    }
    else {signupButton.style.visibility = "hidden"}
    divbutton.appendChild(signupButton);
    console.log("signup is here ")
}

function appearLoginButton(){
    const loginButton = document.createElement('button');
    loginButton.className = 'login-button';
    loginButton.textContent = 'Login';
    if(stillgoing == true)
        {loginButton.style.visibility = "visible"}
    else {loginButton.style.visibility = "hidden"}
    loginButton.onclick = () => {
        makevisible()}
    divbutton.appendChild(loginButton);
    console.log('Login button appeared');
}

async function fetchdata(){
    console.log("fetching Data...")
    let { data: userss, error } = await supabase
        .from('userss')
        .select('username,password')
    if (error == null){
        console.log("Data fetched successfully")
    } else {
        console.log(error)
    }
}

function createloginbox(){
    if (!document.querySelector('.loginbox')) {
        const loginBox = document.createElement('div');
        loginBox.className = "loginbox";
        document.body.appendChild(loginBox);
        loginBox.style.visibility = "hidden";
        const inputfield1 = document.createElement('input');
        inputfield1.placeholder = 'Username';
        const inputfield2 = document.createElement('input');
        inputfield2.type = 'password';
        inputfield2.placeholder = 'Password';
        const btn = document.createElement('button');
        btn.textContent = 'Login';
        const msg = document.createElement('div');
        [inputfield1, inputfield2, btn, msg].forEach(e => loginBox.appendChild(e));
        btn.onclick = async () => {
            const { value: username } = inputfield1, { value: password } = inputfield2;
            if (!username || !password) return msg.textContent = 'Enter username and password.';
            let { data } = await supabase.from('userss').select('username,password').eq('username', username).single();
            if (data && data.password === password) {
                msg.textContent = 'Login successful!';
                mogging = true;
                let moneyValue = await getMoney(username);
                setCookie(username, moneyValue);
                loginBox.style.visibility = 'hidden';
                loggedui(username, moneyValue);
            } else {
                msg.textContent = 'Invalid username or password.';
            }
        };
    }
}

function signup() {
    if (!document.querySelector('.signupbox')) {
        const signupbox = document.createElement("div");
        signupbox.className = "signupbox";
        document.body.appendChild(signupbox);
        signupbox.style.visibility = "hidden";
        const inputfield3 = document.createElement('input');
        inputfield3.placeholder = 'Username';
        const inputfield4 = document.createElement('input');
        inputfield4.type = 'password';
        inputfield4.placeholder = 'Password';
        const btn2 = document.createElement('button');
        btn2.textContent = 'Create User';
        const msg2 = document.createElement('div');
        [inputfield3, inputfield4, btn2, msg2].forEach(e => signupbox.appendChild(e));
        btn2.onclick = async () => {
            const username = inputfield3.value;
            const password = inputfield4.value;
            if (!username || !password) {
                msg2.textContent = "Please fill in both fields.";
                return;
            }
            const IP = await getClientIP();
            let { error } = await supabase.from('userss').insert([{ username, password, IP }]);
            if (!error) {
                msg2.textContent = "Signup successful! You can now log in.";
                signupbox.style.visibility = "hidden";
                fetchdata();
            } else {
                msg2.textContent = "Signup failed. Username might already exist with this IP. Contact the owner(me) to reset your pawword.";
            }
        }
    }
}

function showsignup(){
    const signupBox = document.querySelector('.signupbox');
    const loginBox = document.querySelector('.loginbox');
    if (signupBox) {
        if (!clicked2) {
            signupBox.style.visibility = 'visible';
            clicked2 = true;
        } else {
            signupBox.style.visibility = 'hidden';
            clicked2 = false;
        }
    }
    if (clicked1 && loginBox) {
        loginBox.style.visibility = 'hidden';
        clicked1 = false;
    }
}

function makevisible(){
    console.log(mogging)
    const loginBox = document.querySelector('.loginbox');
    const signupBox = document.querySelector('.signupbox');
    if(mogging==false){
        if (loginBox) {
            if (!clicked1) {
                loginBox.style.visibility = 'visible';
                clicked1 = true;
            } else {
                loginBox.style.visibility = 'hidden';
                clicked1 = false;
            }
        }
        if (clicked2 && signupBox) {
            signupBox.style.visibility = 'hidden';
            clicked2 = false;
        }
    }
    else {
        alert("you are already logged in ")
    }
}

function clearlog(){
    console.log("cleared")
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
}
function loggedui(username, money) {
    const ui = document.getElementById("Profile-Data-box");
    const usernameui = ui.querySelector("#username2");
    const moneyui = ui.querySelector("#money2");
    usernameui.textContent = username || "Unknown";
    moneyui.textContent = money || "Unknown";
    ui.style.visibility = "visible";
    mogging = true;
    stillgoing = false;
    document.querySelectorAll('.sign-up-button, .login-button').forEach(btn => {
        btn.style.visibility = "hidden";
    });
    const loginBox = document.querySelector('.loginbox');
    if (loginBox) loginBox.style.visibility = "hidden";
    const signupBox = document.querySelector('.signupbox');
    if (signupBox) signupBox.style.visibility = "hidden";
}
async function getClientIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip; // e.g. "203.0.113.195"
  } catch (err) {
    console.error('Failed to get IP', err);
    return null;
  }
}

export function logout() {
    mogging = false;
    stillgoing = true;
    clicked1 = false;
    clicked2 = false;
    const ui = document.getElementById("Profile-Data-box");
    ui.style.visibility = "hidden";
    deleteCookie("userInfo");
    alert("You have been logged out.");
    document.querySelectorAll('.sign-up-button, .login-button').forEach(btn => {
        btn.style.visibility = "visible";
    });
    const loginBox = document.querySelector('.loginbox');
    if (loginBox) loginBox.style.visibility = "hidden";
    const signupBox = document.querySelector('.signupbox');
    if (signupBox) signupBox.style.visibility = "hidden";
}
function checkcookie() {
    try {
        const userCookie = document.cookie.split('; ').find(row => row.startsWith('userInfo='));
        if (!userCookie) throw new Error("No cookie found");
        const [username, money] = userCookie.split('=')[1].split('|');
        stillgoing = false;
        console.log("cookie found", username, money);
        loggedui(username, money);
    } catch (error) {
        console.log("no cookie found");
        stillgoing = true;
        return null;
    }
}

function setCookie(username, money) {
    document.cookie = `userInfo=${username}|${money}; path=/Home/Casino`;
    console.log("cookie set:", username, money);
    stillgoing = false;
}

function deleteCookie(cookieName) {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/Home/Casino`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

async function updatemoney(money) {
    
}
function permissionPopup() {
window.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('permission-popup');
    const acceptBtn = document.getElementById('accept-btn');
    const declineBtn = document.getElementById('decline-btn');

    function setCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
    }

    function getCookie(name) {
        return document.cookie.split('; ').reduce((r, v) => {
            const parts = v.split('=');
            return parts[0] === name ? decodeURIComponent(parts[1]) : r
        }, '');
    }

    if (getCookie('ipConsent') === 'true') {
        popup.style.display = 'none';
    } else {
        popup.style.display = 'flex';
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            setCookie('ipConsent', 'true', 30);
            popup.style.display = 'none';
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            alert('You need to accept to use this site.');
            window.location.href = 'https://www.youtube.com/watch?v=xvFZjo5PgG0&list=RDxvFZjo5PgG0&start_radio=1';
        });
    }
});
}
main();
