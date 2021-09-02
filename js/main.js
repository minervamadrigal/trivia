let formMain = document.getElementById("formMain");
let btn = document.getElementById("btn");
let container = document.getElementById("trivia");
let main = document.getElementById("container");
let dataRaw = [];
let dataArray = {};
let urlTrivia = "";
let jsonCache = "";
let score = 0;
let indice = 0;
let lengthArray = 0;

formMain.addEventListener("submit", function(e){
    e.preventDefault();
    dataRaw = [];
    let data = new FormData(formMain);
    for(const [name, value] of data){        
        dataRaw.push(value);
        lengthArray = dataRaw[0];
    }
    urlTrivia = makeUrl(dataRaw);
    console.log(urlTrivia);
    handlerTrivia(urlTrivia);
});

async function handlerTrivia(urlTrivia) {
    let response = await fetch(urlTrivia);
    console.log(response);
    dataArray = await response.json();
    console.log(dataArray.results);    
    renderList(); 
    
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

const renderList = () => {
    removeContainers("container");    
    renderTrivia(dataArray, indice);
    addClickTrivia();    
    previousQuestion();
    nextQuestion();
};

function renderTrivia(dataArray, index){
    let question = dataArray.results[index];
    const header = document.createElement("h2");
    header.innerText = "Trivia";
    header.classList.add("headerTrivia")
    /*main.classList.add("hid");*/
    
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

    let questionButton1 = document.createElement("button");
    questionButton1.innerText = question.correct_answer;
    
    let moveQuestion = document.createElement("div");
    moveQuestion.classList.add("moveQuestion");

    let scoreDiv = document.createElement("div");
    scoreDiv.classList.add("scoreDiv")
    
    const questionButton2 = document.createElement("button");
    questionButton2.innerText = question.incorrect_answers[0];
    const questionButton3 = document.createElement("button");
    questionButton3.innerText = question.incorrect_answers[1];
    const questionButton4 = document.createElement("button");
    questionButton4.innerText = question.incorrect_answers[2];        

    const previousButton = document.createElement("button");
    previousButton.innerText = "Anterior";
    previousButton.classList.add("btnMovePrevious");

    const nextButton = document.createElement("button");
    nextButton.innerText = "Siguiente"
    nextButton.classList.add("btnMoveNext");

    const scoreHeader = document.createElement("h2");
    scoreHeader.innerText = `Tu Puntuacion es: ${score}`;
    scoreHeader.classList.add("scoreHeader")

    container.appendChild(questionContainer);
    questionContainer.appendChild(questionUnique);
    questionContainer.appendChild(buttonContainer);
    questionContainer.appendChild(moveQuestion);
    questionContainer.appendChild(scoreDiv);

    questionUnique.appendChild(questionCategory);
    questionUnique.appendChild(questionDifficulty);
    questionUnique.appendChild(questionQuestion);
    
    if(question.type == "multiple"){
        buttonContainer.appendChild(questionButton1);
        questionButton1.classList.add("correct");
        questionButton1.classList.add("btnTrivia");
        buttonContainer.appendChild(questionButton2);
        questionButton2.classList.add("btnTrivia");
        buttonContainer.appendChild(questionButton3);
        questionButton3.classList.add("btnTrivia");
        buttonContainer.appendChild(questionButton4);
        questionButton4.classList.add("btnTrivia");

    }else{
        buttonContainer.appendChild(questionButton1);
        questionButton1.classList.add("correct");
        questionButton1.classList.add("btnTrivia");
        buttonContainer.appendChild(questionButton2);
        questionButton2.classList.add("btnTrivia");
    }    
        
    moveQuestion.appendChild(previousButton);
    moveQuestion.appendChild(nextButton);

    scoreDiv.appendChild(scoreHeader);
    
}

function addClickTrivia (){
    let getButton = document.querySelectorAll(".btnTrivia");
    let header = document.querySelectorAll(".scoreHeader");
    for(let button of getButton){
        button.addEventListener("click", function(event){
            if(button.className.match("correct btnTrivia")){
                score += 1;
                button.classList.add("w");
                header[0].innerText = `Tu Puntuacion es: ${score}`;
                getButton[0].disabled = true;
                getButton[1].disabled = true;
                getButton[2].disabled = true;
                getButton[3].disabled = true;
            }else{
                button.classList.add("incorrect");
                getButton[0].disabled = true;
                getButton[1].disabled = true;
                getButton[2].disabled = true;
                getButton[3].disabled = true;
            }
        })
    }

}

function previousQuestion(){
    let previousButton = document.querySelectorAll(".btnMovePrevious");
    console.log(previousButton[0])
    previousButton[0].addEventListener("click", function (event){
        if(indice > 0){
            indice = indice - 1;
            removeContainers("questionDiv");
            renderList();
        }
    })
}

function nextQuestion(){
    let nextButton = document.querySelectorAll(".btnMoveNext");
    nextButton[0].addEventListener("click", function (event){        
        if(indice < lengthArray-1){
            console.log(indice)
            indice = indice + 1;            
            
            removeContainers("questionDiv");
            renderList();
        }
    })
}

function removeContainers (classItem){
    let removeContainers = document.getElementsByClassName(classItem);
    while(removeContainers.length > 0){
        removeContainers[0].parentNode.removeChild(removeContainers[0]);  
    }
}

function checkResponse(){
    console.log("gatis")
}