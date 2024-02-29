import questions from "./Questions.js";
import config from "./config.js";

let currentQuestions;
let questionsArray;
let answerArray;
let n;

if (localStorage.getItem("currentQuestions") === null) {
  localStorage.setItem("currentQuestions", JSON.stringify(questions));
  currentQuestions = JSON.parse(
    localStorage.setItem("currentQuestions", currentQuestionsStringified)
  );

  questionsArray = currentQuestions.map((Q) => Q.Q);
  answerArray = currentQuestions.map((Q) => Q.A);
  n = 0;
} else {
  console.log(JSON.parse(localStorage.getItem("currentQuestions")));
  currentQuestions = JSON.parse(localStorage.getItem("currentQuestions"));
  questionsArray = currentQuestions.map((Q) => Q.Q);
  answerArray = currentQuestions.map((Q) => Q.A);
  n = 0;
}

const myKey = config.API_KEY;

//Elements in the doc
const main = document.querySelector("main");
const answer = document.getElementById("answer");
const question = document.getElementById("question");
const form = document.getElementById("myForm");
const input = document.getElementById("myInput");
const submitButton = document.getElementById("submitButton");
const startBtn = document.getElementById("start-btn");
const changeCategoryBtn = document.getElementById("change-category-btn");
const categoryForm = document.getElementById("category-form");
const inputCategory = document.getElementById("input-category");

form.addEventListener("submit", handleFormSubmit);

startBtn.addEventListener("click", function () {
  form.style.display = "flex";
  startBtn.style.display = "none";
  question.textContent = questionsArray[n];
  answer.textContent = generateWord(answerArray[n]);
});

changeCategoryBtn.addEventListener("click", function () {
  main.style.display = "none";
  categoryForm.style.display = "flex";
});

categoryForm.addEventListener("submit", handleChangeCategory);

function handleChangeCategory(event) {
  event.preventDefault();
  createQuiz(inputCategory.value);
  inputCategory.value = "";
}

function handleFormSubmit(event) {
  event.preventDefault();
  if (!answerArray.includes(input.value)) {
    generateRandomIndex(answerArray[n]);
    answer.textContent = generateWord(answerArray[n]);
    input.value = "";
    console.log(randomIndexes);
  } else {
    n += 1;
    randomIndexes = [];
    question.textContent = questionsArray[n];
    answer.textContent = generateWord(answerArray[n]);
    input.value = "";
    console.log(randomIndexes);
  }
}

function createQuiz(topic, number = 5) {
  const url = "https://api.openai.com/v1/chat/completions";
  const bearer = "Bearer " + myKey;
  const prompt = `Give me ${number} trivia questions about ${topic} in Q & A form but in JSON format. 
  ###
  [{
    "Q": "What is the capital city of Mexico?",
    "A":"Mexico city"
  }]
  `;

  fetch(url, {
    method: "POST",
    headers: {
      Authorization: bearer,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const newQuestions = JSON.parse(data.choices[0].message.content); // Parse it to an array
      console.log(newQuestions);
      localStorage.setItem("currentQuestions", JSON.stringify(newQuestions)); // Store the array
      questionsArray = JSON.parse(localStorage.getItem("currentQuestions")).map(
        (Q) => Q.Q
      );
      answerArray = currentQuestions.map((Q) => Q.A);
      n = 0;
      question.textContent = questionsArray[n]; // Update UI
      answer.textContent = generateWord(answerArray[n]); // Update UI
      const confirmation = document.getElementById("confirmation-message");
      confirmation.innerHTML = `Success!Category has been changed  <button id="ok">Ok</button>;`;
      const okButton = document.getElementById("ok");
      okButton.addEventListener("click", function () {
        main.style.display = "flex";
        categoryForm.style.display = "none";
      });
    })
    .catch((error) => {
      console.log("Something bad happened: " + error);
    });
}
let randomIndexes = [];
function generateRandomIndex(word) {
  const letters = word.split("");
  // Ensure we don't loop infinitely
  if (randomIndexes.length >= letters.length) {
    console.log("All possible indexes have been generated.");
    return;
  }
  const randomIndex = Math.floor(Math.random() * letters.length);
  if (!randomIndexes.includes(randomIndex)) {
    randomIndexes.push(randomIndex);
  } else {
    // Recursive call if the generated index is already in the array
    generateRandomIndex(word);
  }
}

function generateWord(word) {
  let letters = word.split("");
  let blanks = letters.map(function (letter, index) {
    if (randomIndexes.includes(index)) {
      return letter;
    } else {
      return "_";
    }
  });
  return blanks.join(" ");
}

//up next:
//get local storage werkin
// squash obvious bugs
// get CSS in! Ahhh exciting!🤩

//Start your refactor here:
//rename functions
//rename elements both in html and in js
//
