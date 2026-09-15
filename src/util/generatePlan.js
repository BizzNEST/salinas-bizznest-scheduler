import shuffle from "./shuffle.js";
import { isValidPair } from "./uniquePairing.js";

// Delimiter for pair keys: "::" cannot appear in an intern name, so keys stay
// unambiguous (and the source stays plain text — a null/space separator would
// collide with multi-word names or make tools treat this file as binary).
const KEY_SEP = "::";

// Canonical key for an unordered pair of intern names.
function pairKey(a, b) {
  return [a, b].sort().join(KEY_SEP);
}

// The target coverage set: every eligible pair on the roster, keyed by
// `pairKey` and mapped to its [nameA, nameB] tuple.
function buildEligible(interns, isEligible) {
  const eligible = new Map();
  for (let i = 0; i < interns.length; i++) {
    for (let j = i + 1; j < interns.length; j++) {
      if (isEligible(interns[i], interns[j])) {
        eligible.set(pairKey(interns[i].name, interns[j].name), [
          interns[i].name,
          interns[j].name,
        ]);
      }
    }
  }
  return eligible;
}

// Add every internal pair of every meeting in `meetings` to the `met` Set.
function recordMeetings(meetings, met) {
  for (const meeting of meetings) {
    for (let i = 0; i < meeting.length; i++) {
      for (let j = i + 1; j < meeting.length; j++) {
        met.add(pairKey(meeting[i].name, meeting[j].name));
      }
    }
  }
}

// Score coverage: only eligible pairs count, each once.
function scoreCoverage(eligible, met) {
  let metCount = 0;
  const unmetPairs = [];
  for (const [k, tuple] of eligible) {
    if (met.has(k)) {
      metCount++;
    } else {
      unmetPairs.push(tuple);
    }
  }
  return { met: metCount, total: eligible.size, unmetPairs };
}

// Every [nameA, nameB] tuple met across the given weeks (used to seed a
// continuation, e.g. re-optimize).
export function metTuplesFromWeeks(weeks) {
  const tuples = [];
  for (const week of weeks) {
    for (const meeting of week.meetings) {
      for (let i = 0; i < meeting.length; i++) {
        for (let j = i + 1; j < meeting.length; j++) {
          tuples.push([meeting[i].name, meeting[j].name]);
        }
      }
    }
  }
  return tuples;
}

// Normalize an `alreadyMet` seed (array of [nameA, nameB] tuples or keys) into
// a Set of canonical keys.
function seedMet(alreadyMet) {
  const met = new Set();
  for (const entry of alreadyMet) {
    if (Array.isArray(entry)) {
      met.add(pairKey(entry[0], entry[1]));
    } else if (typeof entry === "string") {
      met.add(entry);
    }
  }
  return met;
}

function eligibilityFor({ isUniqueDept = false, isUniqueLoc = false }) {
  return (a, b) =>
    a.name !== b.name && isValidPair(a, b, isUniqueDept, isUniqueLoc);
}

// Pure multi-week plan generator. Given a roster and the active Unique Pairing
// options, returns `{ weeks, coverage }` where every eligible pair meets at
// least once (unless a `cap` cuts the plan short). No DOM/localStorage/fetch.
//
// options:
//   isUniqueDept, isUniqueLoc - which axes define an eligible pair
//   cap        - optional max number of weeks
//   alreadyMet - optional seed of pairs already met (continue a partial plan)
export default function generatePlan(interns, options = {}) {
  const { cap = Infinity, alreadyMet = [] } = options;

  const isEligible = eligibilityFor(options);
  const eligible = buildEligible(interns, isEligible);

  const met = seedMet(alreadyMet);
  const hasMet = (a, b) => met.has(pairKey(a.name, b.name));

  // An intern is fully-met once every eligible partner has been met.
  const fullyMet = (intern) =>
    interns.every((o) => !isEligible(intern, o) || hasMet(intern, o));

  const weeks = [];
  let week = 0;
  while (week < cap) {
    const active = interns.filter((i) => !fullyMet(i));
    if (active.length === 0) {
      break;
    }

    const meetings = buildWeekMeetings(active, isEligible, hasMet);
    // Filler/known pairs land in `met` too, but coverage only counts eligible
    // pairs, so they never advance the meter.
    recordMeetings(meetings, met);
    weeks.push({ meetings });
    week++;
  }

  return { weeks, coverage: scoreCoverage(eligible, met) };
}

// Build one week's meetings from the active interns: fresh eligible pairs first,
// then known/not-yet-met filler, then rotated repeats, folding a final leftover
// into a triplet. Every active intern lands in exactly one meeting.
function buildWeekMeetings(active, isEligible, hasMet) {
  const pool = [...active];
  shuffle(pool);

  const meetings = [];
  const matched = new Set();

  // Phase 1: fresh eligible pairings (these advance coverage).
  for (let i = 0; i < pool.length; i++) {
    const a = pool[i];
    if (matched.has(a.name)) {
      continue;
    }
    for (let j = i + 1; j < pool.length; j++) {
      const b = pool[j];
      if (matched.has(b.name)) {
        continue;
      }
      if (isEligible(a, b) && !hasMet(a, b)) {
        meetings.push([a, b]);
        matched.add(a.name);
        matched.add(b.name);
        break;
      }
    }
  }

  // Phase 2: filler for whoever is left — prefer a not-yet-met partner over a
  // true repeat, so even known pairings stay as useful as possible.
  const leftover = pool.filter((p) => !matched.has(p.name));
  for (let i = 0; i < leftover.length; i++) {
    const a = leftover[i];
    if (matched.has(a.name)) {
      continue;
    }
    let repeat = -1;
    let fresh = -1;
    for (let j = i + 1; j < leftover.length; j++) {
      const b = leftover[j];
      if (matched.has(b.name)) {
        continue;
      }
      if (repeat === -1) {
        repeat = j;
      }
      if (!hasMet(a, b)) {
        fresh = j;
        break;
      }
    }
    const pick = fresh !== -1 ? fresh : repeat;
    if (pick === -1) {
      continue; // odd one out, handled below
    }
    const b = leftover[pick];
    meetings.push([a, b]);
    matched.add(a.name);
    matched.add(b.name);
  }

  // Fold a final leftover odd person into the last meeting as a triplet.
  const odd = pool.filter((p) => !matched.has(p.name));
  if (odd.length === 1) {
    if (meetings.length > 0) {
      meetings[meetings.length - 1].push(odd[0]);
    } else {
      meetings.push([odd[0]]);
    }
  }

  return meetings;
}

// Recompute coverage for an arbitrary set of weeks against a roster (used after
// manual edits). Pure: mirrors the accounting `generatePlan` does internally.
export function computeCoverage(interns, weeks, options = {}) {
  const eligible = buildEligible(interns, eligibilityFor(options));
  const met = new Set();
  for (const week of weeks) {
    recordMeetings(week.meetings, met);
  }
  return scoreCoverage(eligible, met);
}

export { pairKey };
