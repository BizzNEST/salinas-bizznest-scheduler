import displayQuestions from "./scripts/questions.js";
import { displayFilters } from "./scripts/filters.js";
import {
  displayInternWeekTable,
  displayInternTable,
} from "./scripts/interns.js";

export let currentSearchQuery = "";
import { displayExportButton } from "./scripts/exportCSV.js";

function main() {
  displayFilters();
  const toggleIconWeek = document.getElementById("toggle-icon-week");
  const toggleIconInterns = document.getElementById("toggle-icon-interns");
  const weekCardContent = document.getElementById("week-card-content");
  const internCardContent = document.getElementById("intern-card-content");
  const generateButtonAnimation = lottie.loadAnimation({
    container: document.getElementById("generate-button-lottie"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "src/assets/lottie/lottie_confetti.json",
  });
  displayInternTable();

  toggleIconWeek.addEventListener("click", () => {
    // Toggle the collapsed class to control max-height
    weekCardContent.classList.toggle("collapsed");

    // Toggle the chevron icon rotation
    toggleIconWeek.classList.toggle("rotate");
  });

  toggleIconInterns.addEventListener("click", () => {
    // Toggle the collapsed class to control max-height
    internCardContent.classList.toggle("collapsed");

    // Toggle the chevron icon rotation
    toggleIconInterns.classList.toggle("rotate");
  });
  const generateButton = document.getElementById("schedule-button");

  generateButton.addEventListener("click", function () {
    displayInternWeekTable();
    displayQuestions();
    displayExportButton();
    generateButtonAnimation.goToAndPlay(0, true);
  });

  const addPairToGeneratedSchedule = document.getElementById("add-pair-button");
  addPairToGeneratedSchedule.addEventListener("click", function () {
    console.log("addPairToGeneratedSchedule was click");
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

  const searchInput = document.getElementById("search-bar");
  if (searchInput) {
    searchInput.addEventListener("input", async function () {
      currentSearchQuery = searchInput.value;
      await displayInternTable();
    });
  } else {
    console.error("Search input element not found");
  }
}

document.addEventListener("DOMContentLoaded", main, { once: true });
