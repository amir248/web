let jsonLd=document.querySelector('head > script[type="application/ld+json"]');
let parseJson=JSON.parse(jsonLd.text);
// console.log(jsonLd.text);
// console.log(parseJson.articleSection);
const date=document.createElement('date');
date.innerHTML="Date Published: "+`${parseJson.datePublished}`;
date.innerHTML="Date Published: "+`${parseJson.datePublished}`+'<br>'+"Date modified: "+`${parseJson.dateModified}`;
date.style.cssText=`
    display:flex;
    justify-content:right;
    width:100%;
    color:green;
    font-size:17px;
`;
const dates=document.createElement('span');
dates.setAttribute('id','date');
document.querySelector('h1').insertAdjacentElement('afterend', dates);

document.querySelector('#date').prepend(date);
// console.log(parseJson.author.alternateName[0]);
// console.log(parseJson.dateModified);
// console.log(JSON.parse(jsonLd.text));
// console.log(jsonLd.outerHTML);
