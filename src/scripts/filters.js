import filters from "../constants/constants.js";

export default function displayFilters() {
  const filtersContainer = document.getElementById("filtersContainer");

  // Create and append the "Generate Schedule" button
  const generateScheduleButton = document.createElement("button");
  generateScheduleButton.className = "filter-button";
  generateScheduleButton.id = "schedule-button";
  generateScheduleButton.type = "button";
  generateScheduleButton.textContent = "Generate Schedule";
  filtersContainer.appendChild(generateScheduleButton);

  for (const filter of filters) {
    const filterContainer = document.createElement("div");
    filterContainer.className = "filter-container";
    filterContainer.innerHTML = `
                  <button class="filter-button">${filter.name}</button>
                  <div class="modal">
                    <div class="fixed-modal-content">
                        <div class="modal-content">
                            <button class="close-modal-button"><i class="fa-solid fa-x"></i></button>
                            <ul class="option-list">
                                ${filter.options
                                  .map(
                                    (option) => `
                                    <li class="option-item">
                                        <label>
                                            <input type="checkbox" value="${option}"> ${option}
                                        </label>
                                    </li>
                                `,
                                  )
                                  .join("")}
                            </ul>
                            <button class="apply-filter">Apply</button>
                        </div>
                      </div>
                  </div>
              `;
    filtersContainer.appendChild(filterContainer);

    const filterButton = filterContainer.querySelector(".filter-button");
    const modal = filterContainer.querySelector(".modal");
    const applyButton = filterContainer.querySelector(".apply-filter");
    const closeButton = filterContainer.querySelector(".close-modal-button");

    filterButton.addEventListener("click", (e) => {
      e.stopPropagation();
      if (modal.style.display === "block") {
        modal.style.display = "none";
      } else {
        closeAllModals();
        modal.style.display = "block";
      }
    });

    applyButton.addEventListener("click", () => {
      modal.style.display = "none";
    });

    closeButton.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  const clearFiltersButton = document.createElement("button");
  clearFiltersButton.className = "filter-button";
  clearFiltersButton.id = "clear-filters-button";
  clearFiltersButton.type = "button";
  clearFiltersButton.textContent = "Clear Filters";
  filtersContainer.appendChild(clearFiltersButton);

  function closeAllModals() {
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.style.display = "none";
    });
  }

  clearFiltersButton.addEventListener("click", () => {
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = false;
    });
  });

  // Close the modals when clicking outside of them
  window.addEventListener("click", (event) => {
    if (!event.target.closest(".filter-container")) {
      closeAllModals();
    }
  });
}
