import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// API-Key aufteilen und erst später zusammensetzen
const part1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.";
const part2 = "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoYW5mcmFqaXNyZ2hjc2t0ZHl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4ODQwOTYsImV4cCI6MjA2NzQ2MDA5Nn0.";
const part3 = "mgR_VSslwqLrvf9iE1IxRY9aUjYvSrxjUa-bfRlyRR8";
const supabaseKey = part1 + part2 + part3;

const supabaseUrl = "https://whanfrajisrghcsktdyv.supabase.co"
const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
    appearsignupButton();
    appearLoginButton();
    console.log('Casino page loaded');
    fetchdata(); //fetches Data from the database will be removed later
    createloginbox();
    signup();
}

function appearsignupButton(){
    const signupButton = document.createElement("button")
    signupButton.className = "login-button";
    signupButton.textContent = "sign up!"
    signupButton.onclick = () => {showsignup()};
    signupButton.style.visibility = "visible"
    document.body.appendChild(signupButton);
    console.log("signup is here ")
}

function appearLoginButton(){
    const loginButton = document.createElement('button');
    loginButton.className = 'login-button';
    loginButton.textContent = 'Login';
    loginButton.onclick = () => {
        makevisible()
    };
    document.body.appendChild(loginButton);
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
    const loginBox = document.createElement('div');
    loginBox.className = "loginbox"
    document.body.appendChild(loginBox)    
    loginBox.style.visibility ="hidden"
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
        const { data } = await supabase.from('userss').select('username,password').eq('username', username).single();
        if (data && data.password === password) {
            msg.textContent = 'Login successful!';
            loginBox.style.visibility = 'hidden';
        } else {
            msg.textContent = 'Invalid username or password.';
        }
    };
}

function signup() {
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
        // Create the user in Supabase
        let { error } = await supabase.from('userss').insert([{ username, password }]);
        if (!error) {
            msg2.textContent = "Signup successful! You can now log in.";
            signupbox.style.visibility = "hidden";
        } else {
            msg2.textContent = "Signup failed. Username might already exist.";
        }
    }
}

function showsignup(){
    document.querySelector('.signupbox').style.visibility = 'visible';
}

function makevisible(){
    document.querySelector('.loginbox').style.visibility = 'visible';
}

main();
