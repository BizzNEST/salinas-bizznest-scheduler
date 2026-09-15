import shuffle from "./shuffle.js";
import pair from "./pair.js";
import { uniquePairingHelper } from "./uniquePairing.js";

// Pure single-round pairing: takes a roster (array of associates) and the active
// Unique Pairing options, returns the meetings. No DOM/localStorage/fetch.
export default function pairRound(
  roster,
  { isUniqueDept = false, isUniqueLoc = false } = {},
) {
  const associates = [...roster];
  shuffle(associates);
  uniquePairingHelper(associates, isUniqueDept, isUniqueLoc);
  return pair(associates);
}

// Maps the "Unique Pairing" selection array (from the filters UI) to the
// boolean options `pairRound` / `generatePlan` expect.
export function uniquePairingOptions(selected = []) {
  return {
    isUniqueDept: selected.includes("Unique Departments"),
    isUniqueLoc: selected.includes("Unique Locations"),
  };
}
