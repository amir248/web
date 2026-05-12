const style=document.createElement("link");
if(window.location.hostname!=="https://new.qucu.ru/"){
    style.setAttribute('href','https://new.qucu.ru/css/menu.css');
}else{
    style.setAttribute('href','css/menu.css');
}
style.setAttribute('rel','stylesheet');
document.querySelector('head').append(style);


const menuText=['<a href="https://fleamarket.qucu.ru/">Fleamarket</a>','<a href="https://qucu.ru">Main</a>','<a href="https://new.qucu.ru/">Persons</a>','<a href="https://comments.qucu.ru/">Comments</a>','<a href="https://comments.qucu.ru/app-comments.apk">Download App</a>','<a href="https://new.qucu.ru/login">Login</a>','<a href="https://new.qucu.ru/register">Registration</a>','<a href="https://new.qucu.ru/about">About</a>'];

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

