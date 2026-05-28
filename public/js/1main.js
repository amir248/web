function menu(){
    return new Promise((resolve)=>{
        function openMenu(){
            let oM=document.createElement('script');
            oM.src='js/menu.js';
            document.querySelector('body').append(oM);
        }
        resolve(openMenu());
    })
}
function language(){
    return new Promise((resolve)=>{
        function openLanguage(){
            let oL=document.createElement('script');
            oL.src='js/language.js';
            document.querySelector('body').append(oL);
        }
        resolve(openLanguage());
    })
}
function russianShip(){
    return new Promise((resolve)=>{
        function deepDown(){
            let dD=document.createElement('script');
            dD.src='js/russianShip.js';
            document.querySelector('body').append(dD);
        }
        resolve(deepDown());
    })
}
function gallaryPhoto(){
    return new Promise((resolve)=>{
        function gallary(){
            let gP=document.createElement('script');
            gP.src='js/correctPhotoGallary.js';
            document.querySelector('body').append(gP);
        }
        resolve(gallary());
    })
}
async function main(){
    // await language();
    await menu();
    await russianShip();

    await gallaryPhoto();
}
main();