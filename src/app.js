import { displayFilters } from "./scripts/filters.js";
import {
  generateSchedule,
  displayAssociateTable,
  initPlanView,
} from "./scripts/associates.js";

export let currentSearchQuery = "";

function main() {
  displayFilters();
  const toggleIconWeek = document.getElementById("toggle-icon-week");
  const toggleIconAssociates = document.getElementById(
    "toggle-icon-associates",
  );
  const weekCardContent = document.getElementById("week-card-content");
  const associateCardContent = document.getElementById(
    "associate-card-content",
  );
  const generateButtonAnimation = lottie.loadAnimation({
    container: document.getElementById("generate-button-lottie"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "src/assets/lottie/lottie_confetti.json",
  });
  displayAssociateTable();
  initPlanView();

  toggleIconWeek.addEventListener("click", () => {
    // Toggle the collapsed class to control max-height
    weekCardContent.classList.toggle("collapsed");

    // Toggle the chevron icon rotation
    toggleIconWeek.classList.toggle("rotate");
  });

  toggleIconAssociates.addEventListener("click", () => {
    // Toggle the collapsed class to control max-height
    associateCardContent.classList.toggle("collapsed");

    // Toggle the chevron icon rotation
    toggleIconAssociates.classList.toggle("rotate");
  });
  const generateButton = document.getElementById("schedule-button");

  generateButton.addEventListener("click", function () {
    const generateScheduleButtonAudio = document.getElementById(
      "generate-button-audio",
    );
    generateScheduleButtonAudio.volume = 0.5;
    generateScheduleButtonAudio.play();
    generateSchedule();
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

  const searchInput = document.getElementById("search-bar");
  if (searchInput) {
    searchInput.addEventListener("input", async function () {
      currentSearchQuery = searchInput.value;
      await displayAssociateTable();
    });
  } else {
    console.error("Search input element not found");
  }
}

document.addEventListener("DOMContentLoaded", main, { once: true });
