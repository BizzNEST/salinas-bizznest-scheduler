export function filterByLocation(interns, locations) {
  return locations.length === 0
    ? interns
    : interns.filter((intern) => locations.includes(intern.location));
}
