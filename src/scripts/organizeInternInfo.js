export default function organizeInternInfo(intern) {
  const col = document.createElement("td"); //Create column for intern
  const internInfo = document.createElement("div"); //Column info div
  internInfo.className = "intern-pill-name-location";

  const pill = document.createElement("div"); //Department pill div
  pill.className = "pill";
  pill.innerHTML = "<b>" + intern.department + "</b>";
  internInfo.appendChild(pill);

  const name = document.createElement("p"); //Name
  name.textContent = intern.name;
  internInfo.appendChild(name);

  const location = document.createElement("p"); //Location
  location.textContent = intern.location;
  internInfo.appendChild(location);

  col.appendChild(internInfo);

  return col;
}
