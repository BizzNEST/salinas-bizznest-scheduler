document.addEventListener("DOMContentLoaded", () => {
  const toggleIcon = document.getElementById("toggle-icon");
  const weekCardContent = document.getElementById("week-card-content");

  toggleIcon.addEventListener("click", () => {
    // Toggle the collapsed class to control max-height
    weekCardContent.classList.toggle("collapsed");

    // Toggle the chevron icon rotation
    toggleIcon.classList.toggle("rotate");
  });
});
