import getInterns from "../api/interns/service.js";
import generateMailToString from "../util/sendEmail.js";
import { filterByDepartment } from "../util/filterByDepartment.js";
import { filterByLocation } from "../util/filterByLocation.js";
import { uniquePairingOptions } from "../util/pairRound.js";
import { stringToKebabCase } from "../util/stringToKebabCase.js";
import { renderDepartmentLists, getSelectedOptions } from "./filters.js";
import { currentSearchQuery } from "../app.js";
import { displayAddModal, displayRemoveModal } from "./edit.js";
import { internsSet, locationEmojiMap } from "../constants/constants.js";
import { dynamicHeader } from "../util/dynamicHeader.js";
import { weekToCSV, planToCSV } from "./exportCSV.js";
import { exportPlan, openImportDialog } from "./planJSON.js";
import makeMenu from "../util/makeMenu.js";
import generatePlan from "../util/generatePlan.js";
import {
  setPlan,
  getPlan,
  getWeekIndex,
  setWeekIndex,
  getCurrentMeetings,
  updateCurrentWeekMeetings,
  setRenderer,
  loadPlan,
  savePlan,
} from "./plan.js";
import { pickQuestions, renderQuestions } from "./questions.js";
import { renderCopyWeek } from "./copyWeek.js";
import { renderReoptimize } from "./reoptimize.js";

// Edit modals still call these; they now act on the currently selected week of
// the plan instead of a flat schedule.
export function savePairsToLocalStorage(pairs) {
  updateCurrentWeekMeetings(pairs);
}

export function loadPairsFromLocalStorage() {
  return getCurrentMeetings();
}

// Build a full multi-week plan from the selected roster and active options.
export function generateSchedule() {
  const interns = getSelectedInterns();
  const options = uniquePairingOptions(getSelectedOptions()["Unique Pairing"]);
  const plan = generatePlan(interns, options);
  plan.options = options;
  setPlan(plan);
  renderPlan();
}

function formatInternWeekDetails(intern) {
  const col = document.createElement("td"); //Create column for intern
  const internInfo = document.createElement("div"); //Column info div
  internInfo.className = "intern-pill-name-location";

  const pill = document.createElement("div"); //Department pill div
  pill.className = `pill pill-${stringToKebabCase(intern.department)}`;
  pill.innerHTML = `<b>${intern.department}</b>`;
  internInfo.appendChild(pill);

  const location = document.createElement("p"); //Location
  location.textContent = `${locationEmojiMap[intern.location]} ${intern.location}`;
  internInfo.appendChild(location);

  const name = document.createElement("p"); //Name
  name.textContent = intern.name;
  internInfo.appendChild(name);
  col.appendChild(internInfo);

  return col;
}

// Backwards-compatible entry point still called by the edit modals: the week's
// meetings are already persisted via savePairsToLocalStorage, so just re-render.
export function displayInternWeekTable() {
  renderPlan();
}

// Compact operations bar: Copy Week, one Export/Backup menu (all CSV + JSON
// actions), and Re-optimize. The static "Add Pair" button stays in the markup.
function planOperationsBar() {
  const container = document.getElementById("pairings-operations");

  let bar = document.getElementById("plan-ops-bar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "plan-ops-bar";
    bar.className = "plan-ops-bar";
    container.insertBefore(bar, container.firstChild);
  }
  bar.innerHTML = "";

  renderCopyWeek(bar);
  bar.appendChild(
    makeMenu("Export / Backup", [
      { label: "This week (CSV)", onClick: weekToCSV },
      { label: "Full plan (CSV)", onClick: planToCSV },
      { label: "Plan backup (JSON)", onClick: exportPlan },
      { label: "Import plan (JSON)", onClick: openImportDialog },
    ]),
  );
  renderReoptimize(bar);
}

// Week selector + coverage meter, injected above the week table.
function renderPlanControls() {
  const plan = getPlan();
  const weekCard = document.getElementById("week-card-content");
  let controls = document.getElementById("plan-controls");
  if (!controls) {
    controls = document.createElement("div");
    controls.id = "plan-controls";
    controls.className = "plan-controls";
    weekCard.insertBefore(controls, weekCard.firstChild);
  }
  controls.innerHTML = "";
  if (!plan) {
    return;
  }

  const selector = document.createElement("div");
  selector.className = "week-selector";
  const label = document.createElement("label");
  label.setAttribute("for", "week-select");
  label.textContent = "Week: ";
  const select = document.createElement("select");
  select.id = "week-select";
  plan.weeks.forEach((_, i) => {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = `Week ${i + 1}`;
    if (i === getWeekIndex()) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
  select.addEventListener("change", () => {
    setWeekIndex(Number(select.value));
    renderPlan();
  });
  label.appendChild(select);
  selector.appendChild(label);
  controls.appendChild(selector);

  const meter = renderCoverageMeter(plan.coverage);
  if (meter) {
    controls.appendChild(meter);
  }
}

// Only surface coverage when it tells the coordinator something: how many
// eligible pairs are left, or a brief done note. Nothing when there is no
// coverage to track (no eligible pairs) or when already complete-and-silent.
function renderCoverageMeter(coverage) {
  if (!coverage || !coverage.total) {
    return null;
  }
  const remaining = coverage.total - coverage.met;
  const meter = document.createElement("div");
  meter.className = "coverage-meter";
  if (remaining === 0) {
    meter.innerHTML = `<span class="coverage-label">✓ Everyone eligible has met</span>`;
    return meter;
  }
  const percent = Math.round((coverage.met / coverage.total) * 100);
  meter.innerHTML = `<span class="coverage-label">${percent}% — ${remaining} eligible pair${remaining === 1 ? "" : "s"} left to meet</span>`;
  return meter;
}

// Show the selected week's ice-breakers, picking + persisting them once per
// week so they stay stable across edits and week switches (per spec story 30).
async function showWeekQuestions() {
  const plan = getPlan();
  if (!plan) {
    return;
  }
  const week = plan.weeks[getWeekIndex()];
  if (!week.questions || week.questions.length === 0) {
    week.questions = await pickQuestions();
    savePlan();
  }
  renderQuestions(week.questions);
}

// Render the whole plan view: controls + selected week's meetings + operations.
export function renderPlan() {
  renderPlanControls();
  renderWeekTable(getCurrentMeetings());
  planOperationsBar();
  showWeekQuestions();
}

// Restore any saved plan on page load and register the renderer so feature
// modules can trigger re-renders.
export function initPlanView() {
  setRenderer(renderPlan);
  const plan = loadPlan();
  if (plan) {
    renderPlan();
  }
}

function renderWeekTable(internPairs) {
  renderDepartmentLists("department-list-2");
  const weekCard = document.getElementById("week-card-content");
  weekCard.style.display = "block";
  const departmentHeader = document.getElementById("department-headers-week");
  departmentHeader.innerText = "Departments";
  const tableHeader = document.getElementById("interns-week-table-header");
  tableHeader.innerHTML = "";

  internPairs.length === 0
    ? (tableHeader.innerHTML = `<tr><th>Not enough Interns selected to pair.</th></tr>`)
    : (tableHeader.innerHTML = dynamicHeader(internPairs));

  const tableBody = document.getElementById("interns-week-table-body");
  tableBody.innerHTML = ""; //clear out any previous pairings

  internPairs.forEach((pair, index) => {
    const row = document.createElement("tr"); //creating group row

    const groupNum = document.createElement("td"); //Group num column
    groupNum.innerHTML = `
    <div class="group-number-container">
      <a class="intern-email" href=${generateMailToString(pair.map((intern) => intern?.email ?? ""))}>📧 Group ${index + 1}</a>
    </div>`;

    const addInternToPairButton = document.createElement("button"); //add edit button
    addInternToPairButton.className = "edit";
    addInternToPairButton.id = "add-intern";
    addInternToPairButton.type = "button";
    addInternToPairButton.innerHTML = `<i class="fa-solid fa-user-plus"></i>`;
    groupNum.appendChild(addInternToPairButton);

    displayAddModal(addInternToPairButton, pair, index); //display add functionality

    const removeInternFromPairButton = document.createElement("button"); //remove edit button
    removeInternFromPairButton.className = "edit";
    removeInternFromPairButton.id = "remove-intern";
    removeInternFromPairButton.type = "button";
    removeInternFromPairButton.innerHTML = `<i class="fa-solid fa-user-minus"></i>`;
    groupNum.appendChild(removeInternFromPairButton);
    row.appendChild(groupNum);

    displayRemoveModal(removeInternFromPairButton, pair, index);

    if (pair.length === 0) {
      removeInternFromPairButton.innerHTML = `<i class="fa-solid fa-minus"></i>`;
    }

    //add intern info columns
    for (const intern of pair) {
      row.appendChild(formatInternWeekDetails(intern));
    }

    //add to table
    tableBody.appendChild(row);
  });
}

export function formatInternDetails(intern) {
  const row = document.createElement("tr"); // Create a row for the intern
  row.dataset.name = intern.name;
  row.dataset.email = intern.email;
  // Create column for the select button
  const selectCol = document.createElement("td");
  const selectButton = document.createElement("button");
  if (internsSet.has(intern.name)) {
    selectButton.className = "pill-selected";
    selectButton.textContent = "Deselect";
  } else {
    selectButton.className = "pill-select";
    selectButton.textContent = "Select";
  }
  selectButton.addEventListener("click", function () {
    if (selectButton.classList.contains("pill-select")) {
      selectButton.textContent = "Deselect";
      selectButton.classList.remove("pill-select");
      selectButton.classList.add("pill-selected");
      internsSet.add(intern.name);
    } else {
      selectButton.textContent = "Select";
      selectButton.classList.remove("pill-selected");
      selectButton.classList.add("pill-select");
      internsSet.delete(intern.name);
    }
  });
  selectCol.appendChild(selectButton);
  row.appendChild(selectCol);

  // Create column for the intern name
  const nameCol = document.createElement("td");
  const namePtag = document.createElement("p");
  namePtag.textContent = intern.name;
  namePtag.className = "intern-list-text";
  nameCol.appendChild(namePtag);
  row.appendChild(nameCol);

  const locationCol = document.createElement("td");
  const locationPtag = document.createElement("p");
  locationPtag.textContent = intern.location;
  locationPtag.className = "intern-list-text";
  locationCol.appendChild(locationPtag);
  row.appendChild(locationCol);

  // Create column for the intern department
  const departmentCol = document.createElement("td");
  const pill = document.createElement("div"); // Department pill div
  pill.className = `pill pill-${stringToKebabCase(intern.department)}`;
  pill.innerHTML = `<b>${intern.department}</b>`;
  departmentCol.appendChild(pill);
  row.appendChild(departmentCol);

  return row;
}

export async function displayInternTable() {
  const filterSelections = getSelectedOptions();

  // Fetches, Filters, and Searches for Interns
  const interns = searchInterns(
    filterByDepartment(
      filterByLocation(
        Object.entries(await getInterns()).map(([intern, internInfo]) => ({
          name: intern,
          ...internInfo,
        })),
        filterSelections.Location,
      ),
      filterSelections.Departments,
    ),
    currentSearchQuery,
  );

  renderDepartmentLists("department-list-1");
  const tableHeader = document.getElementById("interns-table-header");
  tableHeader.innerHTML = "";

  interns.length === 0
    ? (tableHeader.innerHTML = `<tr><th>There are no interns listed</th></tr>`)
    : (tableHeader.innerHTML = `<tr><th>Select</th><th>Intern</th><th>Location</th><th>Department</th></tr>`);

  const tableBody = document.getElementById("interns-table-body");
  tableBody.innerHTML = ""; //clear out any previous pairings

  for (const intern of interns) {
    tableBody.appendChild(formatInternDetails(intern));
  }

  document.getElementById("select-all").addEventListener("click", () => {
    const buttons = document.querySelectorAll(".pill-select");
    buttons.forEach((button) => {
      button.textContent = "Deselect";
      button.classList.remove("pill-select");
      button.classList.add("pill-selected");
      internsSet.add(button.closest("tr").dataset.name);
    });
  });

  document.getElementById("deselect-all").addEventListener("click", () => {
    const buttons = document.querySelectorAll(".pill-selected");
    buttons.forEach((button) => {
      button.textContent = "Select";
      button.classList.remove("pill-selected");
      button.classList.add("pill-select");
      internsSet.delete(button.closest("tr").dataset.name);
    });
  });
}
export function updateInternsTable(newInterns, isAdd) {
  const tableBody = document.getElementById("interns-table-body");
  const rows = tableBody.querySelectorAll("tr");

  // Finds every intern that we added and updates their selection
  newInterns.forEach((newIntern) => {
    rows.forEach((row) => {
      const nameCell = row.cells[1];
      const locationCell = row.cells[2];
      const departmentCell = row.cells[3];
      const selectButton = row.querySelector("button");

      if (
        nameCell.textContent !== newIntern.name ||
        locationCell.textContent !== newIntern.location ||
        departmentCell.textContent !== newIntern.department
      ) {
        return;
      }
      if (isAdd) {
        selectButton.textContent = "Deselect";
        selectButton.classList.add("pill-selected");
        selectButton.classList.remove("pill-select");
      } else {
        selectButton.textContent = "Select";
        selectButton.classList.add("pill-select");
        selectButton.classList.remove("pill-selected");
      }
    });
  });
}

function getSelectedInterns() {
  const selectedInterns = [];
  const rows = document.querySelectorAll("#interns-table-body tr");

  rows.forEach((row) => {
    const selectButton = row.querySelector(".pill-selected");
    if (selectButton == null) {
      return;
    }
    selectedInterns.push({
      name: row.cells[1].textContent,
      location: row.cells[2].textContent,
      department: row.cells[3].textContent,
      email: row.dataset.email,
    });
  });

  return selectedInterns;
}

export function getUnselectedInterns() {
  const unselectedInterns = [];
  const rows = document.querySelectorAll("#interns-table-body tr");

  rows.forEach((row) => {
    const selectButton = row.querySelector(".pill-select");
    if (selectButton == null) {
      return;
    }
    unselectedInterns.push({
      name: row.cells[1].textContent,
      location: row.cells[2].textContent,
      department: row.cells[3].textContent,
      email: row.dataset.email,
    });
  });

  return unselectedInterns;
}

// linear search
function searchInterns(interns, query) {
  const lowerCasedQuery = query.toLowerCase();
  return interns.filter(
    (intern) =>
      intern.name.toLowerCase().includes(lowerCasedQuery) ||
      intern.department.toLowerCase().includes(lowerCasedQuery) ||
      intern.location.toLowerCase().includes(lowerCasedQuery),
  );
}
