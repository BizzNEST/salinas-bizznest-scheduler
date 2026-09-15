export function filterByDepartment(associates, departments) {
  return departments.length === 0
    ? associates
    : associates.filter((associate) =>
        departments.includes(associate.department),
      );
}
