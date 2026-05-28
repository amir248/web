document.querySelector('.menu2').addEventListener('click',()=>{
  menu777();
});
document.querySelector('.menu').addEventListener('click',menu777);
function menuOk(){
  if(document.querySelector('.menu2')){
    // console.log('burger Yest');
    let count = +0;
    document.querySelector('.menu2').onclick=function(){
            count +=1;
            //-----------------
            //------open-close---
            //------------------
            document.getElementsByTagName('body')[0].style.cssText=`overflow:auto`;
            //-------------------
        if(count<=1){
            document.querySelector("#offmenu").classList.add("openmenu");
                            //---------------------------------
                            document.getElementsByTagName('body')[0].style.cssText=`overflow:hidden`;
                            //--------------------------------
        }else{
            document.querySelector("#offmenu").classList.remove('openmenu');
            count =0;
            console.log("Menu close!");
        }
    }
  }else{
    // console.log('burgeraNet');
  }
}//menuOk

// //--------------------------------------------------------------
// //--------ОТПРАВИТЬ ЗАПРОС ЧТОБЫ ПОЛУЧИТЬ МЕНЮ------------------
// //--------------------------------------------------------------
let put= `/var/www/html/menu/menu.html`;
let put1= `http://localhost:3700/menu/menu.html`;
let put3;

if(window.location.pathname=='/yandex/'){
  // console.log(window.location.pathname);
  
}
// console.log(window.location.hostname);
if(window.location.pathname==="https://qucu.ru/yandex/"||"http://localhost:3000/yandex/"||"/yandex/"){
  put3="/menu/menuG.html";
  // console.log(window.location.pathname);
}else if(window.location.href==='http://localhost:3700/'||'192.168.1.177'||'https://qucu.ru/'){
  put3=`menu/menuG.html`;
  // console.log(window.location.href);
  // console.log("menuG"+window.location.href);
}else{
  put3=`/menu/menu.html`;
  // console.log(window.location.href);
}
function run(){
var xhr = new XMLHttpRequest();
xhr.open("GET", `${put3}`, true);
xhr.onreadystatechange = function() {//Вызывает функцию при смене состояния.
if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
document.getElementById("menu").innerHTML = this.responseText;
}
}
xhr.send();
}
run();

let countClick=+0;
function menu777(){
  countClick++;
  if(countClick==1){
    // console.log('click');

    let menuOpen=document.createElement('div');
    menuOpen.style.cssText=`
    display:flex;
    position:fixed;
    font-size:33px;
    justify-content:center;
    align-items:center;
    text-shadow:1px 1px black;
    top:0;
    width:100%;
    height:100%;
    background:grey;
    z-index:2;
    `
    menuOpen.setAttribute('id','menu');
    // menuOpen.innerHTML='there will be a menu here';
    document.querySelector("#offmenu").classList.add("openmenu");

    document.querySelector('nav').prepend(menuOpen);

    document.getElementsByTagName('body')[0].style.cssText=`overflow:hidden`;
  }else if(countClick==2){
    countClick=0;
    removeOpenMenu();
  }
  // menuOk();

  document.getElementById('menu').addEventListener('click',()=>{
    countClick=0;
    removeOpenMenu();
  });
}
function removeOpenMenu(){
  document.getElementsByTagName('body')[0].style.cssText=`overflow:auto`;
  document.querySelector("#offmenu").classList.remove('openmenu');
  document.querySelector("#menu").remove();
}