let formMain = document.getElementById("formMain");
let btn = document.getElementById("btn");
let container = document.getElementById("trivia");
let main = document.getElementById("container");
let dataRaw = [];
let dataArray = {};
let urlTrivia = "";
let score = 0;
let indice = 0;
let lengthArray = 0;
let answers = [];


formMain.addEventListener("submit", function(e){
    e.preventDefault();
    dataRaw = [];
    answers = [];
    let data = new FormData(formMain);
    for(const [name, value] of data){        
        dataRaw.push(value);
        lengthArray = dataRaw[0];
    }
    urlTrivia = makeUrl(dataRaw);
    console.log(urlTrivia);
    for(let i = 0; i <dataRaw[0]; i++){
        answers.push(null); 
    }    
    console.log(answers)
    handlerTrivia(urlTrivia);
});

async function handlerTrivia(urlTrivia) {
    let response = await fetch(urlTrivia);
    console.log(response);
    dataArray = await response.json();
    console.log(dataArray.results);    
    checkArray(dataArray);     
};

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

const renderList = (indexBtn) => {
    removeContainers("container");    
    renderTrivia(dataArray, indice, indexBtn);
    addClickTrivia();    
    previousQuestion();
    nextQuestion();
};

function renderTrivia(dataArray, index, indexBtn){
    let question = dataArray.results[index];
    const header = document.createElement("h2");
    header.innerText = "Trivia";
    header.classList.add("headerTrivia")
    
    const questionContainer = document.createElement("div");
    questionContainer.classList.add("questionDiv");
    questionContainer.appendChild(header);

    const questionUnique = document.createElement("div");
    questionUnique.classList.add("questionUniqueDiv");

    const questionCategory = document.createElement("p");
    questionCategory.innerText = `Categoria: ${question.category}`
    const questionDifficulty = document.createElement("p");
    questionDifficulty.innerText = `Dificultad: ${question.difficulty}`
    questionDifficulty.classList.add(`${question.difficulty}`);
    const questionQuestion = document.createElement("p");
    questionQuestion.innerText = `Pregunta: ${question.question}`

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("actions");
    buttonContainer.setAttribute("id", `${indexBtn}`);

    let questionButton1 = document.createElement("button");
    questionButton1.innerText = question.correct_answer;  

    const questionButton2 = document.createElement("button");
    questionButton2.innerText = question.incorrect_answers[0];    

    const questionButton3 = document.createElement("button");
    questionButton3.innerText = question.incorrect_answers[1];

    const questionButton4 = document.createElement("button");
    questionButton4.innerText = question.incorrect_answers[2];    
    
    let moveQuestion = document.createElement("div");
    moveQuestion.classList.add("moveQuestion");

    //let scoreDiv = document.createElement("div");
    //scoreDiv.classList.add("scoreDiv")

    const previousButton = document.createElement("button");
    previousButton.innerText = "Anterior";
    previousButton.classList.add("btnMovePrevious");

    const nextButton = document.createElement("button");
    nextButton.innerText = "Siguiente"
    nextButton.classList.add("btnMoveNext");

    //const scoreHeader = document.createElement("h2");
   // scoreHeader.innerText = `Tu Puntuacion es: ${score}`;
    //scoreHeader.classList.add("scoreHeader")

    container.appendChild(questionContainer);
    questionContainer.appendChild(questionUnique);
    questionContainer.appendChild(buttonContainer);
    questionContainer.appendChild(moveQuestion);
    //questionContainer.appendChild(scoreDiv);

    questionUnique.appendChild(questionCategory);
    questionUnique.appendChild(questionDifficulty);
    questionUnique.appendChild(questionQuestion);
    
    if(question.type == "multiple"){
        buttonContainer.appendChild(questionButton1);
        questionButton1.classList.add("btnTrivia");
        buttonContainer.appendChild(questionButton2);
        questionButton2.classList.add("btnTrivia");
        buttonContainer.appendChild(questionButton3);
        questionButton3.classList.add("btnTrivia");
        buttonContainer.appendChild(questionButton4);
        questionButton4.classList.add("btnTrivia");

    }else{
        buttonContainer.appendChild(questionButton1);
        questionButton1.classList.add("btnTrivia");
        buttonContainer.appendChild(questionButton2);
        questionButton2.classList.add("btnTrivia");
    }    
        
    moveQuestion.appendChild(previousButton);
    moveQuestion.appendChild(nextButton);

    //scoreDiv.appendChild(scoreHeader);    
}

function addClickTrivia (){
    let getButton = document.querySelectorAll(".btnTrivia");
    //let header = document.querySelectorAll(".scoreHeader");
    
    for(let button of getButton){
        for(let i = 0;i<getButton.length;i++){
            getButton[i].classList.add(i);
        }   
        button.addEventListener("click", function(event){            
                if(button.className.match("0")){
                    score += 1;
                    button.classList.add("w");
                    //header[0].innerText = `Tu Puntuacion es: ${score}`; 
                    answers[indice] = 0;               
                    disableButtons(getButton);
                }else{
                    for(let j = 1; j < getButton.length; j++){
                        if(button.className.match(j)){
                            answers[indice] = j;
                        }
                    }
                    button.classList.add("incorrect");
                    disableButtons(getButton);
                    
                }        
                finishTrivia(dataArray);     
                console.log(answers);                   
        })
    }    
}

function previousQuestion(){
    let previousButton = document.querySelectorAll(".btnMovePrevious");

    previousButton[0].addEventListener("click", function (event){
        if(indice > 0){
            indice = indice - 1;
            removeContainers("questionDiv");
            renderList(indice);
            let buttons = document.querySelectorAll(".btnTrivia");
            checkResponse(buttons);
        }
    })
}

function nextQuestion(){
    let nextButton = document.querySelectorAll(".btnMoveNext");   

    nextButton[0].addEventListener("click", function (event){        
        if(indice < lengthArray-1){
            indice = indice + 1; 
            removeContainers("questionDiv");
            renderList(indice);
            let buttons = document.querySelectorAll(".btnTrivia");
            checkResponse(buttons);
        }
    })
}

function removeContainers (classItem){
    let removeContainers = document.getElementsByClassName(classItem);
    while(removeContainers.length > 0){
        removeContainers[0].parentNode.removeChild(removeContainers[0]);  
    }
}

function disableButtons(buttons){
    for(let i = 0;i<buttons.length;i++){
        buttons[i].disabled = true;
    }   
}

function checkResponse(buttons){    
    if(answers[indice] != null){
        for(button of buttons){
            if(button.className.match(answers[indice])){
                if(answers[indice] == 0){
                    button.classList.add("w");
                }else{
                    button.classList.add("incorrect");
                }                        
            }
        }
        disableButtons(buttons);                
    }
}

function checkArray (array){
    if(array.response_code!= 0){
        alert("No se puede generar la trivia sin preguntas");
        console.log("No se puede generar la trivia sin preguntas");
    }else{
        renderList(indice);
    }
}

function makeHeader(){
    const header = document.createElement("h2");
    header.innerText = `Resumen: Tu Puntuacion fue ${score}`;
    header.classList.add("headerSummary")
    let triviaDiv = document.getElementById("trivia");
    triviaDiv.appendChild(header);
}

function btnRefresh(){
    let refreshButton = document.createElement("button");
    refreshButton.innerText = "Refresh";
    refreshButton.classList.add("btnRefresh");
    let triviaDiv = document.getElementById("trivia");
    triviaDiv.appendChild(refreshButton);
    refreshButton.addEventListener("click", function(event){
        location.reload();
    })
}

function finishTrivia(datas){
    if(!answers.includes(null)){
        removeContainers("questionDiv");
        makeHeader();
        btnRefresh();
        for(let i = 0; i <datas.results.length; i++){
            renderTrivia(datas, i, i); 
            removeContainers("headerTrivia");
            removeContainers("moveQuestion");
            let children = document.getElementById(i).children;            
            for(let j = 0;j < children.length; j++){
                if(answers[i] == j){
                    if(answers[i] == 0){
                        children[j].classList.add("w");
                    }else{
                        children[j].classList.add("incorrect");
                    }
                }
            }
        }                 
        console.log("Finished Game");
    }
}