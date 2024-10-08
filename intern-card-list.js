document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".pill--select, .pill--selected");
  
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        if (button.classList.contains("pill--select")) {
          button.textContent = "Selected";
          button.classList.remove("pill--select");
          button.classList.add("pill--selected");
        } else {
          button.textContent = "Select";
          button.classList.remove("pill--selected");
          button.classList.add("pill--select");
        }
      });
    });6
  });
 