export function filterByLocation(associates, locations) {
  return locations.length === 0
    ? associates
    : associates.filter((associate) => locations.includes(associate.location));
}
