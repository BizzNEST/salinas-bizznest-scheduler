import displayQuestions from "./scripts/questions.js";
import { displayFilters } from "./scripts/filters.js";
import { displayInternTable } from "./scripts/interns.js";

function main() {
  displayFilters();
  const toggleIcon = document.getElementById("toggle-icon");
  const weekCardContent = document.getElementById("week-card-content");
  const generateButtonAnimation = lottie.loadAnimation({
    container: document.getElementById("generate-button-lottie"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "src/assets/lottie/lottie_confetti.json",
  });

  toggleIcon.addEventListener("click", () => {
    // Toggle the collapsed class to control max-height
    weekCardContent.classList.toggle("collapsed");

    // Toggle the chevron icon rotation
    toggleIcon.classList.toggle("rotate");
  });

  const generateButton = document.getElementById("schedule-button");

  generateButton.addEventListener("click", function () {
    displayInternTable();
    displayQuestions();
    generateButtonAnimation.goToAndPlay(0, true);
  });

  const scrollToTop = document.getElementById("scrollToTop");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 0) {
      scrollToTop.style.display = "block";
    } else {
      scrollToTop.style.display = "none";
    }
  });

  scrollToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

document.addEventListener("DOMContentLoaded", main, { once: true });
