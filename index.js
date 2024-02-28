import questions from "./Questions.js";
import config from "./config.js";

const myKey = config.API_KEY;

let word = "sample";
const answer = document.getElementById("answer");
const question = document.getElementById("question");

function createQuiz(topic, number = 5) {
  const url = "https://api.openai.com/v1/chat/completions";
  const bearer = "Bearer " + myKey;
  const prompt = `Give me ${number} trivia questions about ${topic} in Q & A form
    No 2 questions should have the same answer and it should be on a JSON format
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
    .then((data) => console.log(data.choices[0].message.content))
    .catch((error) => {
      console.log("Something bad happened " + error);
    });
}

createQuiz("heart surgery");

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
  generateRandomIndex(word);
  let letters = word.split("");
  let blanks = letters.map(function (letter, index) {
    if (randomIndexes.includes(index)) {
      return letter;
    } else {
      return "_";
    }
  });
  console.log(blanks.join(" "));
  return blanks.join(" ");
}
