import shuffle from "../util/shuffle.js";
import getQuestions from "../api/questions/service.js";

// Pick `amount` random ice-breaker questions (fetches + shuffles the pool).
export async function pickQuestions(amount = 2) {
  const questions = await getQuestions();
  shuffle(questions);
  return questions.slice(0, Math.max(0, amount));
}

// Pick `count` independent random question sets from a single fetch — one set
// per week, so every week gets its own distinct ice-breakers.
export async function pickQuestionSets(count, amount = 2) {
  const pool = await getQuestions();
  const sets = [];
  for (let i = 0; i < count; i++) {
    const shuffled = [...pool];
    shuffle(shuffled);
    sets.push(shuffled.slice(0, Math.max(0, amount)));
  }
  return sets;
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
