import swap from "./swap.js";

export function uniquePairing(interns, selected) {
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

export function isValidGroup(group, isUniqueDept, isUniqueLoc) {
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      if (!isValidPair(group[i], group[j], isUniqueDept, isUniqueLoc)) {
        return false;
      }
    }
  }
  return true;
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
