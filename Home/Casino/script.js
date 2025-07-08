import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabaseUrl = 'https://whanfrajisrghcsktdyv.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoYW5mcmFqaXNyZ2hjc2t0ZHl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4ODQwOTYsImV4cCI6MjA2NzQ2MDA5Nn0.mgR_VSslwqLrvf9iE1IxRY9aUjYvSrxjUa-bfRlyRR8"
const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
    

    appearLoginButton();
    console.log('Casino page loaded');
    fetchdata(); //fetches Data from the database will be romoved later
    console.log('Data fetched from Supabase');
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
    let { data: userss, error } = await supabase
      .from('userss')
      .select('username,password')
    console.log(userss)
}
function createloginbox(){
    const loginBox = document.createElement('div');
    loginBox.className = "loginbox"
    document.body.appendChild(loginBox)    
    loginBox.style.visibility ="hidden"
    const inputfield1 = document.createElement('input');
    inputfield1.placeholder = 'Username';
    const p = document.createElement('input');
    p.type = 'password';
    p.placeholder = 'Password';
    const btn = document.createElement('button');
    btn.textContent = 'Login';
    const msg = document.createElement('div');
    [inputfield1, p, btn, msg].forEach(e => loginBox.appendChild(e));
    btn.onclick = async () => {
        const { value: username } = inputfield1, { value: password } = p;
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
function makevisible(){
    document.querySelector('.loginbox').style.visibility = 'visible';
}
main();


