let formMain = document.getElementById("formMain");
let btn = document.getElementById("btn");
let dataRaw = [];
let urlTrivia = "";
let jsonCache ="";


formMain.addEventListener("submit", function(e){
    e.preventDefault();
    dataRaw = [];
    let data = new FormData(formMain);
    for(const [name, value] of data){
        console.log(name, value);
        dataRaw.push(value);
    }
    urlTrivia = makeUrl(dataRaw);
    console.log(urlTrivia);
    jsonCache = handlerTrivia(urlTrivia);
    console.log(jsonCache);
});

function handlerTrivia(urlTrivia) {
    fetch(urlTrivia)
    .then(response => response.json())
    .then(result => result.response_code);
};

function checkResponse(){
    
    return true
}

function makeUrl(data){
    let initialString = "https://opentdb.com/api.php?";
    let partialUrl = `${initialString}amount=${data[0]}`;

    if(data[1]!="any"){
        partialUrl = `${partialUrl}&category=${data[1]}`
    }
    if(data[2]!="any"){
        partialUrl = `${partialUrl}&difficulty=${data[2]}`
    }
    if(data[3]!="any"){
        partialUrl = `${partialUrl}&type=${data[3]}`
    }
    return partialUrl;
}

