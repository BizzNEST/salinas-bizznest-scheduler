import filters from "../constants/constants.js";
import pair from "../util/pair.js";
import swap from "../util/swap.js";

export function uniquePairing(interns) {
  const selected = getSelectedOptions()["Unique Pairing"];
  if (selected.length < 1) {
    return;
  }

  uniquePairingHelper(
    interns,
    selected.includes("Unique Departments"),
    selected.includes("Unique Locations"),
  );
}

function uniquePairingHelper(interns, isUniqueDept, isUniqueLoc) {
  for (let i = 0; i < interns.length - 1; i += 2) {
    if (isValidPair(interns[i], interns[i + 1], isUniqueDept, isUniqueLoc)) {
      continue;
    }
    for (let j = i + 2; j < interns.length; j++) {
      if (isValidPair(interns[i], interns[j], isUniqueDept, isUniqueLoc)) {
        swap(interns, i + 1, j);
        break;
      }
    }
  }
}

function isValidPair(firstIntern, secondIntern, isUniqueDept, isUniqueLoc) {
  return (
    (!isUniqueDept || firstIntern.department !== secondIntern.department) &&
    (!isUniqueLoc || firstIntern.location !== secondIntern.location)
  );
}

export function filterByLocation(interns) {
  const selected = new Set(getSelectedOptions().Location);
  return selected.size === 0
    ? interns
    : interns.filter((intern) => selected.has(intern.location));
}

export function filterByDepartment(interns) {
  const selected = new Set(getSelectedOptions().Departments);
  return selected.size === 0
    ? interns
    : interns.filter((intern) => selected.has(intern.department));
}

// Function to get all of our filters selected
export function getSelectedOptions() {
  const selectedOptions = {};
  filters.forEach((filter, index) => {
    const checkboxes = document.querySelectorAll(
      `#modal-${index} input[type="checkbox"]:checked`,
    );
    selectedOptions[filter.name] = Array.from(checkboxes).map(
      (checkbox) => checkbox.value,
    );
  });
  return selectedOptions;
}

export function displayFilters() {
  const filtersContainer = document.getElementById("filtersContainer");

  const generateScheduleButton = document.createElement("button");
  generateScheduleButton.className = "filter-button";
  generateScheduleButton.id = "schedule-button";
  generateScheduleButton.type = "button";
  generateScheduleButton.textContent = "Generate Schedule";
  filtersContainer.appendChild(generateScheduleButton);

  filters.forEach((filter, index) => {
    const filterContainer = document.createElement("div");
    filterContainer.className = "filter-container";
    filterContainer.innerHTML = `
      <button class="filter-button filter-config" id="filter-button-${index}">
        <div>${filter.name}</div>
        <i id="toggle-icon-${index}" class="fa-solid fa-chevron-up" style="font-size: 14px;"></i>
      </button>
      <div class="modal" id="modal-${index}">
        <div class="fixed-modal-content">
          <div class="modal-content">
            <button class="close-modal-button" id="close-modal-button-${index}"><i class="fa-solid fa-x"></i></button>
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
        closeModal(index);
      } else {
        closeAllModals();
        modal.style.display = "block";
        toggleIcon(index);
      }
    });

    applyButton.addEventListener("click", () => {
      closeModal(index);
    });

    closeButton.addEventListener("click", () => {
      closeModal(index);
    });
  });

  const clearFiltersButton = document.createElement("button");
  clearFiltersButton.className = "filter-button";
  clearFiltersButton.id = "clear-filters-button";
  clearFiltersButton.type = "button";
  clearFiltersButton.textContent = "Clear Filters";
  filtersContainer.appendChild(clearFiltersButton);

  function toggleIcon(index) {
    const icon = document.getElementById(`toggle-icon-${index}`);
    icon.classList.toggle("rotate");
  }

  function closeModal(index) {
    const icon = document.getElementById(`toggle-icon-${index}`);
    icon.classList.remove("rotate");
    const modal = document.getElementById(`modal-${index}`);
    modal.style.display = "none";
  }

  function closeAllModals() {
    document.querySelectorAll(".modal").forEach((modal, index) => {
      modal.style.display = "none";
      closeModal(index);
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
