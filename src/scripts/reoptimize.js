// Re-optimize remaining weeks. Freezes past weeks and the selected
// week, then regenerates future weeks via generatePlan seeded with the coverage
// accumulated through the frozen weeks.

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

export function reoptimizeRemainingWeeks() {
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
}
