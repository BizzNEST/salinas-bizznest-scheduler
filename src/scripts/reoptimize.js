// Ticket 07: Re-optimize remaining weeks.
// Renders a "Re-optimize remaining weeks" button into `container`. It freezes
// past weeks and the selected week, then regenerates future weeks via
// generatePlan seeded with the coverage accumulated through the frozen weeks.

import {
  getPlan,
  getWeekIndex,
  setPlan,
  collectRoster,
  collectMet,
  recomputeCoverage,
  refresh,
} from "./plan.js";
import generatePlan from "../util/generatePlan.js";

export function renderReoptimize(container) {
  const button = document.createElement("button");
  button.className = "filter-button";
  button.textContent = "Re-optimize remaining weeks";

  button.addEventListener("click", () => {
    const plan = getPlan();
    if (!plan) {
      return;
    }

    // Freeze past weeks and the currently selected week.
    const frozen = plan.weeks.slice(0, getWeekIndex() + 1);

    // Seed with every pair already met across the frozen weeks.
    const seed = collectMet(frozen);

    // Regenerate the future weeks from the frozen coverage state.
    const regenerated = generatePlan(collectRoster(plan), {
      ...plan.options,
      alreadyMet: seed,
    });

    const newPlan = {
      ...plan,
      weeks: [...frozen, ...regenerated.weeks],
      options: plan.options,
    };

    setPlan(newPlan, { resetWeek: false });
    recomputeCoverage();
    refresh();
  });

  container.appendChild(button);
}
