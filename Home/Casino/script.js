console.log ${{API KEY SUPERBASE.SUPERBASE_KEY}}
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabaseUrl = window.env.SUPABASE_URL;
const supabaseKey = window.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
    

    appearLoginButton();
    console.log('Casino page loaded');
    fetchdata(); //fetches Data from the database will be romoved later
    createloginbox();
    
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
        console.log("Data fetched sucsesfully")
    } else console.log(error)
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
function signup(){
    const signupbox = document.createElement("div")
}
function makevisible(){
    document.querySelector('.loginbox').style.visibility = 'visible';
}
main();


