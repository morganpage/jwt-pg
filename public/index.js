import {jwtDecode} from "./jwt-decode.js";

let accessToken = '';
//let api_url = 'https://jwt-pg-morganpage-tech.herokuapp.com/api';
let api_url = '/api';//Will need to make this explicit if front-end on different server
const divLogin = document.getElementById("div-login");
const formLogin = document.getElementById("form-login");
const buttonGetUsers = document.getElementById("button-get-users");
const buttonRefreshToken = document.getElementById("button-refresh-token");
const buttonDeleteToken = document.getElementById("button-delete-token");
const pStatus = document.getElementById("login-status");

let showLoginPanel = (bShow) => {
  bShow ? divLogin.style.display = "flex" : divLogin.style.display = "none";
}

formLogin.onsubmit = async e => {
  e.preventDefault();
  const loginDetails = await login({ email: formLogin.email.value, password: formLogin.password.value });
  console.log(loginDetails);
  if (loginDetails.error) {
    pStatus.innerText = loginDetails.error;
    return;
  }
  accessToken = loginDetails.accessToken;
  const jwtDecoded = jwtDecode(accessToken);
  pStatus.innerHTML = `Login Successful! </br> Hello ${jwtDecoded.user_name}</br> Your id is ${jwtDecoded.user_id}</br> Your email is ${jwtDecoded.user_email}`;
  showLoginPanel(false);
}

async function login(data) {
  //console.log(JSON.stringify(data));
  const res = await fetch(`${api_url}/auth/login`, {
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
    showLoginPanel(true);
    return;
  }
  users.forEach(({user_name,user_email}) => {
    let el = document.createElement("li");
    el.innerText = `${user_name} - ${user_email}`; 
    elUserList.append(el);
  });
}

async function fetchUsers(token) {
  const res = await fetch(`${api_url}/users`, {
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
  const jwtDecoded = jwtDecode(accessToken);
  pStatus.innerHTML = `Login Successful! </br> Hello ${jwtDecoded.user_name}</br> Your id is ${jwtDecoded.user_id}</br> Your email is ${jwtDecoded.user_email}`;
  showLoginPanel(false);
}

async function fetchRefreshToken(){
  const res = await fetch(`${api_url}/auth/refresh_token`,{
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    credentials: 'include'
  });  
  const jsonResponse = await res.json();
  return jsonResponse;
}

buttonDeleteToken.onclick = async () => {
  const deleteDetails = await deleteToken();
  if (deleteDetails.error) {
    pStatus.innerText = deleteDetails.error;
    return;
  }
  accessToken = "";
  pStatus.innerText = deleteDetails.message;
  showLoginPanel(true);
}

async function deleteToken(){
  const res = await fetch(`${api_url}/auth/refresh_token`,{
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    credentials: 'include'
  });  
  return await res.json();
}

