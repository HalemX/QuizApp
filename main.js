//Select Elements
let countSpan = document.querySelector(".count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let bullets = document.querySelector(".bullets");
let quizArea = document.querySelector(".quiz-area");
let ansArea = document.querySelector(".answer-area");
let ans = document.querySelectorAll(".answer");
let submitButton = document.querySelector(".submit-button");
let theResultsContainer = document.querySelector(".result");
let countdownElement = document.querySelector(".countdown");

//Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;
//Function To Req Data From JSON File
function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;

      //Create Bullets + Set Questions Count Argument
      createBullets(qCount);

      //Add Questions Data Argument
      createQuestionsData(questionsObject[currentIndex], qCount);

      //countdown function
      countDown(30, qCount);

      //click on submit
      submitButton.onclick = () => {
        //get the right answer
        let theRightAnswer = questionsObject[currentIndex].right_answer;

        //increase currentIndex
        currentIndex++;

        //check the answer
        checkAnswer(theRightAnswer, qCount);

        //Remove Previous Question And Answers
        quizArea.innerHTML = "";
        ansArea.innerHTML = "";

        //Add New Question And Answers
        createQuestionsData(questionsObject[currentIndex], qCount);

        //HandleBullets function
        HandleBullets();

        //countdown function
        clearInterval(countDownInterval);
        countDown(30, qCount);

        //Show Results function
        showResults(qCount);
      };
    }
  };

  myRequest.open("Get", "./html_questions.json", true);
  myRequest.send();
}

getQuestions();

//Function To Create Bullets + Set Questions Count
function createBullets(num) {
  countSpan.innerHTML = num;

  //Create Spans
  for (let i = 0; i < num; i++) {
    //create Bullet === span
    let theBullet = document.createElement("span");

    //Check First Index === First Bullet === First Span
    if (i === 0) {
      theBullet.className = "on";
    }

    //Append Bullets === spans To Main Bullet Container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

//Function To Add Data
function createQuestionsData(obj, count) {
  if (currentIndex < count) {
    //Create H2 Question title
    let questionTitle = document.createElement("h2");

    //Create Question Text
    let questionText = document.createTextNode(obj["title"]);

    //Append Text To H2
    questionTitle.appendChild(questionText);

    //Append H2 To Quiz Area
    quizArea.appendChild(questionTitle);

    //create the answer
    for (let i = 1; i <= 4; i++) {
      //create main div
      let mainDiv = document.createElement("div");

      //add class to main div
      mainDiv.className = "answer";

      //create input radio
      let radioInput = document.createElement("input");

      //Add Type + Name + Id + Data-Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      //Make First Option Checked

      //create label
      let ansLabel = document.createElement("label");

      //create answer text
      let randomNum = Math.floor(Math.random() * 4 + 1);
      let ansLabelText = document.createTextNode(obj[`answer_${randomNum}`]);

      //Append Text To ansLabel
      ansLabel.appendChild(ansLabelText);

      //Add For Attribute
      ansLabel.htmlFor = `answer_${i}`;

      //Add radioInput and ansLabel to mainDiv
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(ansLabel);

      //Add main div to ansArea
      ansArea.appendChild(mainDiv);
    }
  }
}

//Function to check answer
function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let chosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      chosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === chosenAnswer) {
    rightAnswers++;
    console.log("Good");
  }
}

//Function to HandleBullets
function HandleBullets() {
  let bulletsSpans = document.querySelectorAll(".spans span");
  bulletsSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

//Function to showResults
function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    console.log(ansArea);
    quizArea.remove();
    ansArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count} Is Good`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, All Answers Is perfect`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count} Is Bad`;
    }
    theResultsContainer.innerHTML = theResults;
    theResultsContainer.style.padding = "10px";
    theResultsContainer.style.backgroundColor = "white";
    theResultsContainer.style.marginTop = "10px";
  }
}

//countDown
function countDown(duration, count) {
  //if question exist the countdown exist
  if (currentIndex < count) {
    let minutes, seconds;
    //countDownInterval must be global to stop when submit clicked
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}