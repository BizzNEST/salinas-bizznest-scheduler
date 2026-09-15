// Create a dropdown menu: a filter-styled toggle button plus a list of actions.
// items: [{ label, onClick }]
export default function makeMenu(label, items) {
  const wrap = document.createElement("div");
  wrap.className = "op-menu";

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "filter-button op-menu-toggle";
  toggle.innerHTML = `${label} <i class="fa-solid fa-chevron-down"></i>`;

  const list = document.createElement("div");
  list.className = "op-menu-list";

  for (const item of items) {
    const entry = document.createElement("button");
    entry.type = "button";
    entry.className = "op-menu-item";
    entry.textContent = item.label;
    entry.addEventListener("click", () => {
      list.classList.remove("open");
      item.onClick();
    });
    list.appendChild(entry);
  }

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    list.classList.toggle("open");
  });
  // Close when clicking anywhere outside the menu.
  document.addEventListener("click", () => list.classList.remove("open"));

  wrap.appendChild(toggle);
  wrap.appendChild(list);
  return wrap;
}
