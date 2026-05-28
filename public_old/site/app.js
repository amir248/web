const http = require("http");
http.createServer(function(request,response){
     
    response.end("Hello NodeJS! Amir Shikaren!"+`${userName}`);
     
}).listen(3000, "localhost",function(){
    console.log("Сервер начал прослушивание запросов на порту 3000");
});


const os = require("os");
// получим имя текущего пользователя
let userName = os.userInfo().username;
 
newFunction();
let currentDate = new Date();
module.exports.date = currentDate;
 
module.exports.getMessage = (userName) => {
    let hour = currentDate.getHours();
    if (hour > 16)
        return "Добрый вечер, " + userName;
    else if (hour > 10)
        return "Добрый день, " + userName;

    else
        return "Доброе утро, " + userName;
}

function newFunction() {
    console.log(userName);
}
