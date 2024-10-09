export function filterByDepartment(interns, departments) {
  return departments.length === 0
    ? interns
    : interns.filter((intern) => departments.includes(intern.department));
}
