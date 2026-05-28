const style=document.createElement("link");
if(window.location.hostname!=="https://qucu.ru/"){
    style.setAttribute('href','https://qucu.ru/css/menu1.css');
}else{
    style.setAttribute('href','css/menu1.css');
}
style.setAttribute('rel','stylesheet');
document.querySelector('head').append(style);


const menuText=['<a href="https://fleamarket.qucu.ru/">Fleamarket</a>','<a href="https://qucu.ru">Main</a>','<a href="https://qucu.ru/user">Persons</a>','<a href="https://qucu.ru/comments">Comments</a>','<a href="https://qucu.ru/app-comments.apk">Download App</a>','<a href="https://qucu.ru/login">Login</a>','<a href="https://qucu.ru/register">Registration</a>','<a href="https://qucu.ru/about">About</a>'];

const menuAround=document.createElement("div");
menuAround.classList.add("menu");
setTimeout(()=>{
    menuAround.textContent="🍔";
},733);

document.querySelector("body").prepend(menuAround);
const listMenu=document.createElement("div");
listMenu.classList.add("listMenu");

document.querySelector("body").prepend(listMenu);
let countClick=+0;
document.querySelector('.menu').addEventListener("click",()=>{
    countClick++;
    
    const openMenu=document.createElement("div");
    listMenu.innerHTML=`${menuText}`;
    setTimeout(()=>{
        listMenu.classList.toggle("openListMenu");
    },333);
    
});

