// Ticket 06: JSON export / import (round-trip).
// Renders "Export plan (JSON)" and "Import plan (JSON)" controls into
// `container`. Export downloads the full plan structure; import validates a
// well-formed plan, confirms replacement, then loads it and refreshes.

import { getPlan, setPlan, refresh } from "./plan.js";
import makeFilterButton from "../util/makeFilterButton.js";

export function renderPlanJSON(container) {
  const exportButton = makeFilterButton("Export plan (JSON)", exportPlan);
  container.appendChild(exportButton);

  const importButton = makeFilterButton("Import plan (JSON)");
  container.appendChild(importButton);

  // Hidden file input triggered by the Import button.
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json";
  fileInput.style.display = "none";
  container.appendChild(fileInput);

  importButton.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      importPlan(file);
    }
    // Reset so selecting the same file again still fires "change".
    fileInput.value = "";
  });
}

function exportPlan() {
  const plan = getPlan();
  if (!plan) {
    return;
  }

  const blob = new Blob([JSON.stringify(plan, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.download = "intern-plan.json";
  link.href = window.URL.createObjectURL(blob);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
}

function importPlan(file) {
  const reader = new FileReader();
  reader.onload = () => {
    let parsed;
    try {
      parsed = JSON.parse(reader.result);
    } catch {
      window.alert("Invalid plan file: not valid JSON.");
      return;
    }

    const error = validatePlan(parsed);
    if (error) {
      window.alert(`Invalid plan file: ${error}`);
      return;
    }

    if (!window.confirm("This will replace your current plan — continue?")) {
      return;
    }

    setPlan(parsed);
    refresh();
  };
  reader.onerror = () => {
    window.alert("Invalid plan file: could not read the file.");
  };
  reader.readAsText(file);
}

// Returns an error message if `plan` is not a well-formed plan, else null.
function validatePlan(plan) {
  if (typeof plan !== "object" || plan === null) {
    return "not a plan object.";
  }
  if (!Array.isArray(plan.weeks)) {
    return "missing a weeks array.";
  }
  for (const week of plan.weeks) {
    if (
      typeof week !== "object" ||
      week === null ||
      !Array.isArray(week.meetings)
    ) {
      return "a week is missing its meetings array.";
    }
  }
  return null;
}
