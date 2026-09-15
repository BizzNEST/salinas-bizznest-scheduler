import getAssociates from "../api/associates/service.js";
import generateMailToString from "../util/sendEmail.js";
import { filterByDepartment } from "../util/filterByDepartment.js";
import { filterByLocation } from "../util/filterByLocation.js";
import { uniquePairingOptions } from "../util/pairRound.js";
import { stringToKebabCase } from "../util/stringToKebabCase.js";
import { renderDepartmentLists, getSelectedOptions } from "./filters.js";
import { currentSearchQuery } from "../app.js";
import { displayAddModal, displayRemoveModal, addEmptyPair } from "./edit.js";
import { associatesSet, locationEmojiMap } from "../constants/constants.js";
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
import { pickQuestionSets, renderQuestions } from "./questions.js";
import { renderCopyWeek } from "./copyWeek.js";
import { reoptimizeRemainingWeeks } from "./reoptimize.js";

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
  const associates = getSelectedAssociates();
  const options = uniquePairingOptions(getSelectedOptions()["Unique Pairing"]);
  const plan = generatePlan(associates, options);
  plan.options = options;
  setPlan(plan);
  renderPlan();
}

function formatAssociateWeekDetails(associate) {
  const col = document.createElement("td"); //Create column for associate
  const associateInfo = document.createElement("div"); //Column info div
  associateInfo.className = "associate-pill-name-location";

  const pill = document.createElement("div"); //Department pill div
  pill.className = `pill pill-${stringToKebabCase(associate.department)}`;
  pill.innerHTML = `<b>${associate.department}</b>`;
  associateInfo.appendChild(pill);

  const location = document.createElement("p"); //Location
  location.textContent = `${locationEmojiMap[associate.location]} ${associate.location}`;
  associateInfo.appendChild(location);

  const name = document.createElement("p"); //Name
  name.textContent = associate.name;
  associateInfo.appendChild(name);
  col.appendChild(associateInfo);

  return col;
}

// Backwards-compatible entry point still called by the edit modals: the week's
// meetings are already persisted via savePairsToLocalStorage, so just re-render.
export function displayAssociateWeekTable() {
  renderPlan();
}

// Compact operations bar, one flat row: Copy Week, an Export/Backup menu (all
// CSV + JSON actions), and an Edit menu (add pair, re-optimize).
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
  bar.appendChild(
    makeMenu("Edit", [
      { label: "Add pair", onClick: addEmptyPair },
      {
        label: "Re-optimize remaining weeks",
        onClick: reoptimizeRemainingWeeks,
      },
    ]),
  );
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

// Ensure EVERY week has its own distinct ice-breaker set (so they're stable
// across edits/week switches and present in exports even for weeks never
// viewed), then render the selected week's set.
async function showWeekQuestions() {
  const plan = getPlan();
  if (!plan) {
    return;
  }
  const missing = plan.weeks.filter(
    (week) => !week.questions || week.questions.length === 0,
  );
  if (missing.length > 0) {
    const sets = await pickQuestionSets(missing.length);
    missing.forEach((week, i) => {
      week.questions = sets[i];
    });
    savePlan();
  }
  renderQuestions(plan.weeks[getWeekIndex()].questions);
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

function renderWeekTable(associatePairs) {
  renderDepartmentLists("department-list-2");
  const weekCard = document.getElementById("week-card-content");
  weekCard.style.display = "block";
  const departmentHeader = document.getElementById("department-headers-week");
  departmentHeader.innerText = "Departments";
  const tableHeader = document.getElementById("associates-week-table-header");
  tableHeader.innerHTML = "";

  associatePairs.length === 0
    ? (tableHeader.innerHTML = `<tr><th>Not enough Associates selected to pair.</th></tr>`)
    : (tableHeader.innerHTML = dynamicHeader(associatePairs));

  const tableBody = document.getElementById("associates-week-table-body");
  tableBody.innerHTML = ""; //clear out any previous pairings

  associatePairs.forEach((pair, index) => {
    const row = document.createElement("tr"); //creating group row

    const groupNum = document.createElement("td"); //Group num column
    groupNum.innerHTML = `
    <div class="group-number-container">
      <a class="associate-email" href=${generateMailToString(pair.map((associate) => associate?.email ?? ""))}>📧 Group ${index + 1}</a>
    </div>`;

    const addAssociateToPairButton = document.createElement("button"); //add edit button
    addAssociateToPairButton.className = "edit";
    addAssociateToPairButton.id = "add-associate";
    addAssociateToPairButton.type = "button";
    addAssociateToPairButton.innerHTML = `<i class="fa-solid fa-user-plus"></i>`;
    groupNum.appendChild(addAssociateToPairButton);

    displayAddModal(addAssociateToPairButton, pair, index); //display add functionality

    const removeAssociateFromPairButton = document.createElement("button"); //remove edit button
    removeAssociateFromPairButton.className = "edit";
    removeAssociateFromPairButton.id = "remove-associate";
    removeAssociateFromPairButton.type = "button";
    removeAssociateFromPairButton.innerHTML = `<i class="fa-solid fa-user-minus"></i>`;
    groupNum.appendChild(removeAssociateFromPairButton);
    row.appendChild(groupNum);

    displayRemoveModal(removeAssociateFromPairButton, pair, index);

    if (pair.length === 0) {
      removeAssociateFromPairButton.innerHTML = `<i class="fa-solid fa-minus"></i>`;
    }

    //add associate info columns
    for (const associate of pair) {
      row.appendChild(formatAssociateWeekDetails(associate));
    }

    //add to table
    tableBody.appendChild(row);
  });
}

export function formatAssociateDetails(associate) {
  const row = document.createElement("tr"); // Create a row for the associate
  row.dataset.name = associate.name;
  row.dataset.email = associate.email;
  // Create column for the select button
  const selectCol = document.createElement("td");
  const selectButton = document.createElement("button");
  if (associatesSet.has(associate.name)) {
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
      associatesSet.add(associate.name);
    } else {
      selectButton.textContent = "Select";
      selectButton.classList.remove("pill-selected");
      selectButton.classList.add("pill-select");
      associatesSet.delete(associate.name);
    }
  });
  selectCol.appendChild(selectButton);
  row.appendChild(selectCol);

  // Create column for the associate name
  const nameCol = document.createElement("td");
  const namePtag = document.createElement("p");
  namePtag.textContent = associate.name;
  namePtag.className = "associate-list-text";
  nameCol.appendChild(namePtag);
  row.appendChild(nameCol);

  const locationCol = document.createElement("td");
  const locationPtag = document.createElement("p");
  locationPtag.textContent = associate.location;
  locationPtag.className = "associate-list-text";
  locationCol.appendChild(locationPtag);
  row.appendChild(locationCol);

  // Create column for the associate department
  const departmentCol = document.createElement("td");
  const pill = document.createElement("div"); // Department pill div
  pill.className = `pill pill-${stringToKebabCase(associate.department)}`;
  pill.innerHTML = `<b>${associate.department}</b>`;
  departmentCol.appendChild(pill);
  row.appendChild(departmentCol);

  return row;
}

export async function displayAssociateTable() {
  const filterSelections = getSelectedOptions();

  // Fetches, Filters, and Searches for Associates
  const associates = searchAssociates(
    filterByDepartment(
      filterByLocation(
        Object.entries(await getAssociates()).map(
          ([associate, associateInfo]) => ({
            name: associate,
            ...associateInfo,
          }),
        ),
        filterSelections.Location,
      ),
      filterSelections.Departments,
    ),
    currentSearchQuery,
  );

  renderDepartmentLists("department-list-1");
  const tableHeader = document.getElementById("associates-table-header");
  tableHeader.innerHTML = "";

  associates.length === 0
    ? (tableHeader.innerHTML = `<tr><th>There are no associates listed</th></tr>`)
    : (tableHeader.innerHTML = `<tr><th>Select</th><th>Associate</th><th>Location</th><th>Department</th></tr>`);

  const tableBody = document.getElementById("associates-table-body");
  tableBody.innerHTML = ""; //clear out any previous pairings

  for (const associate of associates) {
    tableBody.appendChild(formatAssociateDetails(associate));
  }

  document.getElementById("select-all").addEventListener("click", () => {
    const buttons = document.querySelectorAll(".pill-select");
    buttons.forEach((button) => {
      button.textContent = "Deselect";
      button.classList.remove("pill-select");
      button.classList.add("pill-selected");
      associatesSet.add(button.closest("tr").dataset.name);
    });
  });

  document.getElementById("deselect-all").addEventListener("click", () => {
    const buttons = document.querySelectorAll(".pill-selected");
    buttons.forEach((button) => {
      button.textContent = "Select";
      button.classList.remove("pill-selected");
      button.classList.add("pill-select");
      associatesSet.delete(button.closest("tr").dataset.name);
    });
  });
}
export function updateAssociatesTable(newAssociates, isAdd) {
  const tableBody = document.getElementById("associates-table-body");
  const rows = tableBody.querySelectorAll("tr");

  // Finds every associate that we added and updates their selection
  newAssociates.forEach((newAssociate) => {
    rows.forEach((row) => {
      const nameCell = row.cells[1];
      const locationCell = row.cells[2];
      const departmentCell = row.cells[3];
      const selectButton = row.querySelector("button");

      if (
        nameCell.textContent !== newAssociate.name ||
        locationCell.textContent !== newAssociate.location ||
        departmentCell.textContent !== newAssociate.department
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

function getSelectedAssociates() {
  const selectedAssociates = [];
  const rows = document.querySelectorAll("#associates-table-body tr");

  rows.forEach((row) => {
    const selectButton = row.querySelector(".pill-selected");
    if (selectButton == null) {
      return;
    }
    selectedAssociates.push({
      name: row.cells[1].textContent,
      location: row.cells[2].textContent,
      department: row.cells[3].textContent,
      email: row.dataset.email,
    });
  });

  return selectedAssociates;
}

export function getUnselectedAssociates() {
  const unselectedAssociates = [];
  const rows = document.querySelectorAll("#associates-table-body tr");

  rows.forEach((row) => {
    const selectButton = row.querySelector(".pill-select");
    if (selectButton == null) {
      return;
    }
    unselectedAssociates.push({
      name: row.cells[1].textContent,
      location: row.cells[2].textContent,
      department: row.cells[3].textContent,
      email: row.dataset.email,
    });
  });

  return unselectedAssociates;
}

// linear search
function searchAssociates(associates, query) {
  const lowerCasedQuery = query.toLowerCase();
  return associates.filter(
    (associate) =>
      associate.name.toLowerCase().includes(lowerCasedQuery) ||
      associate.department.toLowerCase().includes(lowerCasedQuery) ||
      associate.location.toLowerCase().includes(lowerCasedQuery),
  );
}
