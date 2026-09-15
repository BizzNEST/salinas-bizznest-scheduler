// Ticket 04: Copy Week to Google Chat.
// Renders a "Copy Week" button into `container` that copies the selected week's
// meetings to the clipboard as plain grouped text (week header + numbered
// meetings, name + location per intern; triplets on one line).

import { getCurrentMeetings, getWeekIndex } from "./plan.js";

// Build the plain-text block that pastes straight into Google Chat.
function formatWeek(meetings, weekIndex) {
  const lines = [`Week ${weekIndex + 1}`];
  meetings.forEach((meeting, index) => {
    const interns = meeting.map(
      (intern) => `${intern.name} (${intern.location})`,
    );
    const separator = interns.length > 2 ? ", " : " & ";
    lines.push(`${index + 1}. ${interns.join(separator)}`);
  });
  return lines.join("\n");
}

export function renderCopyWeek(container) {
  const button = document.createElement("button");
  button.className = "filter-button";
  button.textContent = "Copy Week";

  button.addEventListener("click", async () => {
    const text = formatWeek(getCurrentMeetings(), getWeekIndex());
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "Copied!";
    } catch {
      button.textContent = "Copy failed";
    }
    setTimeout(() => {
      button.textContent = "Copy Week";
    }, 1500);
  });

  container.appendChild(button);
}
