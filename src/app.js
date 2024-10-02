import displayQuestions from "./scripts/questions.js";
import displayFilters from "./scripts/filters.js";
import displayInternPairs from "./scripts/interns.js";
function main() {
  displayFilters();
  const toggleIcon = document.getElementById("toggle-icon");
  const weekCardContent = document.getElementById("week-card-content");

  toggleIcon.addEventListener("click", () => {
    // Toggle the collapsed class to control max-height
    weekCardContent.classList.toggle("collapsed");

    // Toggle the chevron icon rotation
    toggleIcon.classList.toggle("rotate");
  });

  const generateButton = document.getElementById("schedule-button");

  generateButton.addEventListener("click", function () {
    displayInternPairs();
    displayQuestions();
  });
}

document.addEventListener("DOMContentLoaded", main, { once: true });
