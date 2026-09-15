// Create a standard filter-styled button used across the plan operation bar.
export default function makeFilterButton(label, onClick) {
  const button = document.createElement("button");
  button.className = "filter-button";
  button.type = "button";
  button.textContent = label;
  if (onClick) {
    button.addEventListener("click", onClick);
  }
  return button;
}
