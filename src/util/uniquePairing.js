import swap from "./swap.js";

export function uniquePairing(associates, selected) {
  if (selected.length < 1) {
    return;
  }

  uniquePairingHelper(
    associates,
    selected.includes("Unique Departments"),
    selected.includes("Unique Locations"),
  );
}

export function uniquePairingHelper(associates, isUniqueDept, isUniqueLoc) {
  for (let i = 0; i < associates.length - 1; i += 2) {
    if (
      isValidPair(associates[i], associates[i + 1], isUniqueDept, isUniqueLoc)
    ) {
      continue;
    }
    for (let j = i + 2; j < associates.length; j++) {
      if (
        isValidPair(associates[i], associates[j], isUniqueDept, isUniqueLoc)
      ) {
        swap(associates, i + 1, j);
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
  firstAssociate,
  secondAssociate,
  isUniqueDept,
  isUniqueLoc,
) {
  return (
    (!isUniqueDept ||
      firstAssociate.department !== secondAssociate.department) &&
    (!isUniqueLoc || firstAssociate.location !== secondAssociate.location)
  );
}
