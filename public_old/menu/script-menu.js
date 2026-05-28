window.addEventListener('scroll', menU);
window.addEventListener('DOMContentLoaded',menU);
function menU(){
  if(document.querySelector('.burg')){
    var count = +0;
    document.querySelector('.burg').addEventListener('click',opMenu);
    document.querySelector('#offmenu').addEventListener('click',opMenu);
    
    function opMenu(){
            count +=1;
            document.getElementsByTagName('body')[0].style.cssText=`overflow:auto`;
        if(count<=1){
            document.querySelector("#offmenu").classList.add("openmenu");
                            document.getElementsByTagName('body')[0].style.cssText=`overflow:hidden`;
          document.querySelector('#offmenu').style.cssText=`
            width:0;
            transition: ease 2s;
            `;
          setTimeout(()=>{
            document.querySelector('#offmenu').style.cssText=`
            width:100%;
            transition: ease 2s;
            `;
          },1);
        }else{
          document.querySelector('#offmenu').style.cssText=`
            width:0%;
            opacity:0;
            font-size:0px;
            transition: ease 1s;
            `;
            setTimeout(()=>{
              document.querySelector("#offmenu").classList.remove('openmenu');
            },300);
            count =0;
            // console.log("Menu close!");
        }
    }
  }else{
    // console.log('burgeraNet');
  }
}