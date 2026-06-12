// добавляем имя из LocalStorage
  let savedUser = localStorage.getItem("username");
// const id;
let id =ID_FROM_SERVER;
const d=new Date();
// console.log(id);
const loc=window.location.href;
// console.log(loc);
let type=window.location.pathname;
// console.log(type);
if(type=="/") type="/1";
let strType=(type.match(/\//g) || []).length;
if(strType==2){
  console.log(strType);
  type = type.replace(/^\/([^\/]*)\/?/g, "/$1");
  console.log(type);
  // return type;
}else if(strType==3){
  console.log(strType);
  type = type.replace(/\/(?!$)/g, (m, i) => (i === 0 ? m : "-"));
  console.log(type);
  // return type;
}else{
  // console.log(strType);
}
// console.log(type);
// let id="a111";
if(!localStorage.getItem("username")){
  const authorizationForm=document.createElement("form");
  // authorizationForm.setAttribute('id','permission');
  authorizationForm.classList.add("permission");
  document.querySelector("#comments").append(authorizationForm);
  const authorization=document.createElement("section");
  authorization.classList.add('login');
  document.querySelector('.permission').append(authorization);
  const input=document.createElement('input');
  input.setAttribute("name","name");
  input.setAttribute("type","text");
  input.setAttribute("id","login");
  input.setAttribute("placeholder","Login");
  document.querySelector('.login').append(input);
  const pass=document.createElement("input");
  pass.setAttribute('id','password');
  pass.setAttribute('type','password');
  pass.setAttribute("placeholder","password");
  document.querySelector(".login").append(pass);

  // const cloudFlares=document.createElement("div");
  // cloudFlares.classList.add("cf-turnstile");
  // cloudFlares.setAttribute("data-sitekey","0x4AAAAAACV49q7NnLFk2P0U");
  // document.querySelector(".login").append(cloudFlares);
  const cloudFlares = document.createElement("div");
  cloudFlares.id = "cf-login";
  document.querySelector(".login").append(cloudFlares);

  cloudFlaresLogin = turnstile.render("#cf-login", {
    sitekey: "0x4AAAAAACV49q7NnLFk2P0U",
    callback: (token) => {
      loginCaptchaToken = token;
    },
    "expired-callback": () => {
      loginCaptchaToken = null;
    }
  });


  const push=document.createElement("button");
  push.setAttribute("id","push");
  push.textContent="Авторизироваться";
  document.querySelector(".login").append(push);
  const register=document.createElement("a");
  register.setAttribute("title","Registarion");
  register.href="https://qucu.ru/register";
  register.textContent="🪄(регистрация)";
  document.querySelector(".login").append(register);
}else{
  // console.log('non');
  // Если есть, выводим логин вверху
 bye();
}
const form=document.createElement('form');
form.classList.add('formWebWorkshop');
document.getElementById('comments').prepend(form);

const inputSecond=document.createElement('input');
inputSecond.setAttribute("name","message");
inputSecond.setAttribute("type","text");
inputSecond.setAttribute("id","messages");
inputSecond.setAttribute("placeholder","messages");
document.querySelector('#comments > form').append(inputSecond);
const button=document.createElement('button');
button.textContent='send';
document.querySelector('#comments > form').append(button);

const commentsList=document.createElement("div");
commentsList.setAttribute("id","comments-list");
document.querySelector("#comments").after(commentsList);
const forma = document.querySelector(".formWebWorkshop");

forma.addEventListener("submit", async (e) => {
  e.preventDefault(); // чтобы форма не перезагружала страницу
  // собираем данные
  const formData = new FormData(form);
  const data = {};
  data.name="unknown guest";
  // 👉 добавляем логин вручную
  const login = localStorage.getItem("username"); // или другой источник
  if (login) {
    data.name = login;
    data.date=`${d}`;
    data.loc=`${loc}`;
    data.id=`${id}`;
  }
  formData.forEach((value, key) => {
    data[key] = value;
    console.log(data);
  });
  
  
  try {
    const response = await fetch("https://qucu.ru/comments/"+`${id}`+`${type}`, {
      method: "POST",
      credentials: "include", // 🔥 ОБЯЗАТЕЛЬНО
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    console.log(document.cookie);
    if (response.ok) {
      console.log("Комментарий отправлен!");
      sendButton.disabled=true;
      form.reset();
    } else {
      console.log("Ошибка при отправке комментария");
    }
  } catch (err) {
    console.error(err);
    console.log("Сетевая ошибка");
  }
});


// функция для удаления <style> и <script>
function sanitizeMessage(str) {
  return str.replace(/<\s*style.*?>.*?<\s*\/\s*style\s*>/gis, "")
            .replace(/<\s*script.*?>.*?<\s*\/\s*script\s*>/gis, "");
}

// функция для экранирования других спецсимволов
function escapeHTML(str) {
  if(!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


async function loadComments() {
  try {
    const response = await fetch("https://qucu.ru/comments/"+`${id}`+`${type}`);
    if (!response.ok) throw new Error("Ошибка загрузки комментариев");
    const comments = await response.json();
    // контейнер для вывода
    const list = document.getElementById("comments-list");
    list.innerHTML = ""; // очищаем перед выводом
    comments.forEach(c => {
      const item = document.createElement("div");
      item.classList.add("comment");

      const safeName = escapeHTML(c.name);
      const safeMessage = sanitizeMessage(c.message); // удаляем style/script
      const safeDate = escapeHTML(c.date);

      item.innerHTML = `<p><b>${safeName}</b>: ${safeMessage}</p> <span>${safeDate}</span>`;
      list.appendChild(item);
    });
  } catch (err) {
    console.error(err);
  }
}
setInterval(loadComments,7777);
// loadComments();

const sendButton=document.querySelector(".formWebWorkshop > button");
let inputMessage=document.querySelector("#messages");
sendButton.disabled=true;
function keyDown(){
  inputMessage.addEventListener('keydown',()=>{
    keyTestSubject();
  });
}//keyDown
keyDown();
function keyTestSubject(){
  if(inputMessage.value.length>1){
    sendButton.disabled=false;
  }else{
    sendButton.disabled=true;
  }
}


async function doLogin() {
  const login = document.getElementById("login").value;
  const password = document.getElementById("password").value;

  if (!loginCaptchaToken) {
    alert("Пройдите капчу");
    return;
  }
// https://qucu.ru/login3-proxy-captcha
  try {
    const res = await fetch("https://qucu.ru/login3", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        login,
        password,
        "cf-turnstile-response": loginCaptchaToken
      })
    });

    const data = await res.json();

    // токен одноразовый
    loginCaptchaToken = null;
    turnstile.reset(cloudFlaresLogin);

    if (res.ok) {
      localStorage.setItem("username", login);
      document.querySelector(".permission").remove();
      checkProfile();
      alert("Успешный вход!");
      bye();
    } else {
      alert(data.message || "Ошибка входа");
    }

  } catch (err) {
    console.error(err);
  }
}//do Login



async function checkProfile() {
  const res = await fetch("https://qucu.ru/profile3", {
    method: "GET",
    credentials: "include"  // <- тоже важно
  });
  const data = await res.json();
  console.log("Профиль:", data);
}
if(document.getElementById("push")){
  document.getElementById("push").addEventListener("click", (e) => {
    e.preventDefault();
    doLogin();
  });
}else{
  // console.log('Final Fantasy');
}

/* <button id="logoutBtn">Выйти</button> */
async function logOutUser() {
  console.log("logout");
  try {
    // console.log('logout');
  
    const response = await fetch("https://qucu.ru/logout", {
      method: "POST",
      credentials: "include", // важно для сессий
    });

    const result = await response.json();

    if (result.success) {
      console.log("Сессия удалена на сервере:", result.message);

      // 2️⃣ Удаляем локальные данные (чтобы logout был полным)
      localStorage.removeItem("username");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      sessionStorage.clear(); // на всякий случай очищаем и sessionStorage

      // 3️⃣ (опционально) уведомляем UI
      console.log("Вы вышли из системы");
      window.location.href = "/"; // или reload
    } else {
      console.error("Ошибка logout:", result.message);
    }
  } catch (err) {
    console.error("Ошибка при logout:", err);
  }
}




function bye(){
    let  savedUser = localStorage.getItem("username"); // 🔥 всегда актуально
    const userDisplay = document.createElement("div");
    userDisplay.textContent = `Привет, ${savedUser}!`;
    userDisplay.style.fontWeight = "bold";
    userDisplay.style.marginBottom = "10px";
    document.querySelector("#comments").append(userDisplay);

    const logOutBtn=document.createElement("span");
    logOutBtn.setAttribute("id","logOutBtn");
    logOutBtn.classList.add("logOut");
    logOutBtn.textContent="👋(выход)";
    logOutBtn.setAttribute("title","logOut");
    document.querySelector("#comments > div").append(logOutBtn);
    if (logOutBtn) {
        document.getElementById("logOutBtn").addEventListener("click", logOutUser);
    }
    // localStorage.setItem("username", login);
}//bye();