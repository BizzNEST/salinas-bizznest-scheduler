import shuffle from "../util/shuffle.js";
import getQuestions from "../api/questions/service.js";

// Pick `amount` random ice-breaker questions (fetches + shuffles the pool).
export async function pickQuestions(amount = 2) {
  const questions = await getQuestions();
  shuffle(questions);
  return questions.slice(0, Math.max(0, amount));
}

// Render a fixed set of questions into the ice-breakers container.
export function renderQuestions(questions = []) {
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

// Convenience: pick fresh questions and render them.
export default async function displayQuestions(amountOfQuestions = 2) {
  renderQuestions(await pickQuestions(amountOfQuestions));
}
