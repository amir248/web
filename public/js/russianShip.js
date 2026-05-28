const siteState={};
siteState.countClick=+0;
function realRussianShip(){
  siteState.countClick++;
  if(siteState.countClick==7){
    console.log('😂');
    document.querySelector('.yellowBackground > picture > img').style.cssText=`
    transform: rotate(3deg);
    transition: all 1s ease-out;
    // top:10px;
    bottom:-10px;
    `
  }else if(siteState.countClick==14){
    document.querySelector('.yellowBackground > picture > img').style.cssText=`
    transform: rotate(7deg);
    transition: all 1s ease-out;
    // top:20px;
    bottom:-20px;
    `
  }else if(siteState.countClick==21){
    document.querySelector('.yellowBackground > picture > img').style.cssText=`
    transform: rotate(17deg);
    transition: all 1s ease-out;
    // top:30px;
    bottom:-30px;
    `
  }else if(siteState.countClick==43){
    document.querySelector('.yellowBackground > picture > img').style.cssText=`
    transform: rotate(37deg);
    transition: all 1s ease-out;
    top:50px;
    bottom:-50px;
    `
  }else if(siteState.countClick==73){
    document.querySelector('.yellowBackground > picture > img').style.cssText=`
    transform: rotate(37deg);
    transition: all 1s ease-out;
    // top:170px;
    opacity:0;
    bottom:-170px;

    `
    siteState.countClick=0;
  }
}
document.querySelector('.yellowBackground > picture > img').addEventListener('click',realRussianShip);
document.querySelector('.yellowBackground > picture > img').addEventListener('touch',realRussianShip);
