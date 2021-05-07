let accessToken = '';
let url = 'https://jwt-pg-morganpage-tech.herokuapp.com';//http://localhost:5000
//let url = 'http://localhost:5000';//http://localhost:5000
const formLogin = document.getElementById("form-login");
const buttonGetUsers = document.getElementById("button-get-users");
const buttonRefreshToken = document.getElementById("button-refresh-token");
const pStatus = document.getElementById("login-status");

formLogin.onsubmit = async e => {
  e.preventDefault();
  const loginDetails = await login({ email: formLogin.email.value, password: formLogin.password.value });
  console.log(loginDetails);
  if (loginDetails.error) {
    pStatus.innerText = loginDetails.error;
    return;
  }
  accessToken = loginDetails.accessToken;
  pStatus.innerText = "Login Successful!";
}

async function login(data) {
  console.log(JSON.stringify(data));
  const res = await fetch(`${url}/login`, {
    method: 'POST',
    credentials:'include',
    cache:'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return await res.json();
}


buttonGetUsers.onclick = async () => {
  const elUserList = document.getElementById("user-list");
  elUserList.innerHTML = ""
  const {users,error} = await fetchUsers(accessToken);
  if(error){
    pStatus.innerText = error;
    return;
  }
  users.forEach(({user_name,user_email}) => {
    let el = document.createElement("li");
    el.innerText = `Name: ${user_name} Email: ${user_email}`; 
    elUserList.append(el);
  });
}

async function fetchUsers(token) {
  const res = await fetch(`${url}/users`, {
    headers: {
      'Authorization': 'Bearer ' + token,
    }
  });
  return await res.json();
}


buttonRefreshToken.onclick = async () => {
  const refreshDetails = await fetchRefreshToken();
  if (refreshDetails.error) {
    pStatus.innerText = refreshDetails.error;
    return;
  }
  accessToken = refreshDetails.accessToken;
  pStatus.innerText = "Login Successful!";
}

async function fetchRefreshToken(){
  const res = await fetch(`${url}/refresh_token`,{
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    credentials: 'include'
  });  
  const jsonResponse = await res.json();
  return jsonResponse;
  // if (res.status === 200) {
  //   return { accessToken: jsonResponse.accessToken };
  // }
  // return { error: jsonResponse };
}