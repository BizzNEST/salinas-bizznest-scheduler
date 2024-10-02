import shuffle from "../util/shuffle.js";
import getQuestions from "../api/questions/service.js";

export default async function displayQuestions(amountOfQuestions = 2) {
  let questions = await getQuestions(); // fetch questions
  shuffle(questions); // shuffle them
  questions = questions.slice(0, Math.max(0, amountOfQuestions)); // get the amountOfQuestions

  const iceBreakersContainer = document.getElementById("ice-breakers");
  iceBreakersContainer.innerHTML = `<h3>Ice Breakers</h3><ol id="ice-breaker-questions"></ol>`;

  const ol = document.getElementById("ice-breaker-questions");
  ol.innerHTML = ""; // Clear any existing questions
  for (const question of questions) {
    const li = document.createElement("li");
    li.textContent = question;
    ol.appendChild(li);
  }
}
