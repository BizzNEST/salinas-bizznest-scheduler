import filters from "../constants/constants.js";
import { stringToKebabCase } from "../util/stringToKebabCase.js";
import swap from "../util/swap.js";
import { displayInternTable } from "./interns.js";

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

export function uniquePairingHelper(interns, isUniqueDept, isUniqueLoc) {
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

export function isValidPair(
  firstIntern,
  secondIntern,
  isUniqueDept,
  isUniqueLoc,
) {
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

export function renderDepartmentLists(...containerIds) {
  const selectedOptions = getSelectedOptions().Departments;

  containerIds.forEach((containerId) => {
    const departmentList = document.getElementById(containerId);
    departmentList.innerHTML = ""; // Clear existing list items

    if (selectedOptions) {
      selectedOptions.forEach((department) => {
        const listItem = document.createElement("li");
        listItem.className = `pill pill-${stringToKebabCase(department)}`;
        listItem.textContent = department;
        departmentList.appendChild(listItem);
      });
    }
  });
}

export function displayFilters() {
  const filtersContainer = document.getElementById("filtersContainer");

  // Create the parent container to hold both the button and the Lottie animation
  const parentContainer = document.createElement("div");
  parentContainer.style.position = "relative";
  parentContainer.style.display = "inline-block";

  // Create the button
  const generateScheduleButton = document.createElement("button");
  generateScheduleButton.className = "filter-button";
  generateScheduleButton.id = "schedule-button";
  generateScheduleButton.type = "button";
  generateScheduleButton.textContent = "Generate Schedule";
  parentContainer.appendChild(generateScheduleButton);

  // Create the container for the Lottie animation
  const lottieContainer = document.createElement("div");
  lottieContainer.id = "generate-button-lottie";
  parentContainer.style.overflow = "hidden";

  // Append the Lottie container and the button to the parent container
  parentContainer.appendChild(lottieContainer);
  parentContainer.appendChild(generateScheduleButton);

  // Append the parent container to the filters container
  filtersContainer.appendChild(parentContainer);

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
                   <div class="checkbox-wrapper-39">
                    <label>
                      <input type="checkbox" value="${option}"/>
                      <span class="checkbox"></span>
                    </label>
                  </div>
                  <span class="option-label">${option}</span>
                </li>
              `,
                )
                .join("")}
            </ul>
          </div>
        </div>
      </div>
    `;
    filtersContainer.appendChild(filterContainer);

    const filterButton = filterContainer.querySelector(".filter-button");
    const modal = filterContainer.querySelector(".modal");
    const closeButton = filterContainer.querySelector(".close-modal-button");

    function addCheckboxListeners() {
      const checkboxes = filterContainer.querySelectorAll(
        'input[type="checkbox"]',
      );
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", async () => {
          await displayInternTable();
          renderDepartmentLists("department-list-1");
        });
      });
    }

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
      addCheckboxListeners();
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

  clearFiltersButton.addEventListener("click", async () => {
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = false;
    });
    await displayInternTable();
  });

  // Close the modals when clicking outside of them
  window.addEventListener("click", (event) => {
    if (!event.target.closest(".filter-container")) {
      closeAllModals();
    }
  });
}
