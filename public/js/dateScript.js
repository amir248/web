let jsonLd=document.querySelector('head > script[type="application/ld+json"]');
let parseJson=JSON.parse(jsonLd.text);
// console.log(parseJson.articleSection);
const date=document.createElement('div');
date.setAttribute('id','date');
date.innerHTML="Date Published: "+`${parseJson.datePublished}`;
date.innerHTML="Date Published: "+`${parseJson.datePublished}`+'<br>'+"Date modified: "+`${parseJson.dateModified}`;
date.style.cssText=`
display:flex;
justify-content:right;
width:100%;
color:green;
`
document.querySelector('h1').after(date);
// console.log(parseJson.author.alternateName[0]);
// console.log(parseJson.dateModified);
// console.log(JSON.parse(jsonLd.text));
// console.log(jsonLd.outerHTML);
