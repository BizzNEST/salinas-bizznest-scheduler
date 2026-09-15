import { computeCoverage, metTuplesFromWeeks } from "../util/generatePlan.js";

// Storage + in-memory state for the multi-week plan. This is the layer that
// wraps the pure `generatePlan`/`computeCoverage` seam; it is the only place
// that touches localStorage for the plan.

const PLAN_KEY = "associatePlan";
const LEGACY_KEY = "associatePairs";

let plan = null;
let currentWeekIndex = 0;
let renderer = () => {};

// The plan view registers its render function so feature modules can trigger a
// re-render without importing the UI layer (avoids a circular dependency).
export function setRenderer(fn) {
  renderer = fn;
}
export function refresh() {
  renderer();
}

export function getPlan() {
  return plan;
}
export function getWeekIndex() {
  return currentWeekIndex;
}
export function setWeekIndex(index) {
  if (!plan) {
    return;
  }
  currentWeekIndex = Math.max(0, Math.min(index, plan.weeks.length - 1));
}
export function getCurrentWeek() {
  return plan?.weeks?.[currentWeekIndex] ?? null;
}
export function getCurrentMeetings() {
  return getCurrentWeek()?.meetings ?? [];
}

export function savePlan() {
  if (plan) {
    localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
  }
}

export function setPlan(newPlan, { resetWeek = true } = {}) {
  plan = newPlan;
  if (!plan.options) {
    plan.options = {};
  }
  if (resetWeek) {
    currentWeekIndex = 0;
  }
  currentWeekIndex = Math.max(
    0,
    Math.min(currentWeekIndex, plan.weeks.length - 1),
  );
  savePlan();
}

// Load an existing plan, migrating a legacy flat `associatePairs` schedule into
// week 1 of the new structure so upgrading never discards current work.
export function loadPlan() {
  const raw = localStorage.getItem(PLAN_KEY);
  if (raw) {
    try {
      plan = JSON.parse(raw);
      if (!plan.options) {
        plan.options = {};
      }
      return plan;
    } catch {
      /* fall through to migration */
    }
  }
  const legacy = localStorage.getItem(LEGACY_KEY);
  if (legacy) {
    try {
      const pairs = JSON.parse(legacy);
      plan = {
        weeks: [{ meetings: pairs }],
        coverage: null,
        options: {},
      };
      savePlan();
      return plan;
    } catch {
      /* ignore malformed legacy data */
    }
  }
  return null;
}

// Every distinct associate across all weeks of the plan.
export function collectRoster(source = plan) {
  const map = new Map();
  for (const week of source.weeks) {
    for (const meeting of week.meetings) {
      for (const associate of meeting) {
        map.set(associate.name, associate);
      }
    }
  }
  return [...map.values()];
}

// The met-pair seed accumulated across the given weeks (for re-optimize).
export function collectMet(weeks) {
  return metTuplesFromWeeks(weeks);
}

export function recomputeCoverage() {
  if (!plan) {
    return;
  }
  plan.coverage = computeCoverage(
    collectRoster(),
    plan.weeks,
    plan.options || {},
  );
}

// Replace the current week's meetings (from the edit modals) and recompute.
export function updateCurrentWeekMeetings(meetings) {
  if (!plan) {
    return;
  }
  plan.weeks[currentWeekIndex].meetings = meetings;
  recomputeCoverage();
  savePlan();
}
