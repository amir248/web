window.addEventListener('DOMContentLoaded',languageChina);
  window.addEventListener('DOMContentLoaded',language);
document.querySelector('#languageChina').addEventListener('click',()=>{
    languageChina();
  });
  function languageChina(){
    // console.log('click');
    document.querySelector('body > header:nth-child(1) > nav:nth-child(1) > ol:nth-child(2) > label:nth-child(9) > li:nth-child(1) > input:nth-child(1)').checked=false;
    if(document.querySelector('body > header:nth-child(1) > nav:nth-child(1) > ol:nth-child(2) > label:nth-child(10) > li:nth-child(1) > input:nth-child(1)').checked){
      for(let y=0;y<document.querySelectorAll('#china').length;y++){
        document.querySelectorAll('#eng')[y].style.display="none";
        document.querySelectorAll('#china')[y].style.display="block";
        document.querySelectorAll('#rus')[y].style.display="none";
      }
    }else{
      for(let y=0;y<document.querySelectorAll('#eng').length;y++){
        document.querySelectorAll('#rus')[y].style.display="none";
        document.querySelectorAll('#china')[y].style.display="none";
        document.querySelectorAll('#eng')[y].style.display="block";
      }
    }
  }


  function language(){
    document.querySelector('#languageChina').checked=false;
    if(document.querySelector('body > header > nav > ol > label > li > input').checked){
      for(let y=0;y<document.querySelectorAll('#eng').length;y++){
        document.querySelectorAll('#eng')[y].style.display="none";
        document.querySelectorAll('#china')[y].style.display="none";
        document.querySelectorAll('#rus')[y].style.display="block";
      }
    }else{
      for(let y=0;y<document.querySelectorAll('#eng').length;y++){
        document.querySelectorAll('#rus')[y].style.display="none";
        document.querySelectorAll('#china')[y].style.display="none";
        document.querySelectorAll('#eng')[y].style.display="block";
      }
    }
  }
  
    document.querySelector('body > header > nav > ol > label > li > input').addEventListener('click',()=>{
      language();
    });
    if(window.innerWidth<700){
      // console.log('ok');
      let rus=document.createElement('label');
      rus.style.cssText=`
      text-align:center;
      `;
      document.querySelector('body > header:nth-child(1) > nav:nth-child(1)').append(rus);
      let label=document.createElement('span');
      // label.setAttribute('id','language');
      label.innerHTML=`Rus`;
      document.querySelector('nav > label').append(label);
      let input=document.createElement('input');
      input.type="checkbox";
      input.setAttribute('id','language');
      document.querySelector('nav > label').append(input);

      document.querySelector('#language').addEventListener('click',()=>{
        document.querySelector('#languageChina').indeterminate = false;
        document.querySelector('#languageChina').checked=false;
        document.querySelector('#China').indeterminate = false;
        document.querySelector('#China').checked=false;
        if(document.querySelector('#language').checked){
          for(let y=0;y<document.querySelectorAll('#eng').length;y++){
            document.querySelectorAll('#eng')[y].style.display="none";
            document.querySelectorAll('#china')[y].style.display="none";
            document.querySelectorAll('#rus')[y].style.display="block";
          }
        }else{
          for(let y=0;y<document.querySelectorAll('#eng').length;y++){
            document.querySelectorAll('#rus')[y].style.display="none";
            document.querySelectorAll('#china')[y].style.display="none";
            document.querySelectorAll('#eng')[y].style.display="block";
          }
        }
      });

    //   China
      let china=document.createElement('label');
      china.style.cssText=`
      text-align:center;
      `;
      document.querySelector('body > header:nth-child(1) > nav:nth-child(1)').append(china);
      let labelc=document.createElement('span');
      // label.setAttribute('id','language');
      labelc.innerHTML=`中國人`;
      document.querySelector('nav > label:nth-child(4)').append(labelc);
      let inputc=document.createElement('input');
      inputc.type="checkbox";
      inputc.setAttribute('id','China');
      document.querySelector('nav > label:nth-child(4)').append(inputc);

      document.querySelector('#China').addEventListener('click',()=>{
        document.querySelector('#language').indeterminate = false;
        document.querySelector('#language').checked=false;
        if(document.querySelector('#China').checked){
          for(let y=0;y<document.querySelectorAll('#eng').length;y++){
            document.querySelectorAll('#eng')[y].style.display="none";
            document.querySelectorAll('#china')[y].style.display="block";
            document.querySelectorAll('#rus')[y].style.display="none";
          }
        }else{
          for(let y=0;y<document.querySelectorAll('#eng').length;y++){
            document.querySelectorAll('#rus')[y].style.display="none";
            document.querySelectorAll('#china')[y].style.display="none";
            document.querySelectorAll('#eng')[y].style.display="block";
          }
        languageChina();
        }
      });

    }//ifElseCreateElement