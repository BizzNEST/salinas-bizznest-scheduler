export function dynamicHeader(arr) {
  const lengths = arr.map((item) => item.length);
  const maxVal = Math.max(...lengths);

  let headerString = "<tr><th>Group</th><th>Interns</th>";
  for (let i = 1; i < maxVal; i++) {
    headerString = headerString + "<th></th>";
  }

  return headerString + "</tr>";
}
