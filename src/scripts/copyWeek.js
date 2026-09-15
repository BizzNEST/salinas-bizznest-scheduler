// Copy Week to Google Chat.
// Renders a "Copy Week" button into `container` that copies the selected week's
// meetings to the clipboard as plain grouped text (week header + numbered
// meetings by name, then the week's ice-breaker questions).

import { getCurrentMeetings, getWeekIndex, getCurrentWeek } from "./plan.js";
import makeFilterButton from "../util/makeFilterButton.js";

// Build the plain-text block that pastes straight into Google Chat.
function formatWeek(meetings, weekIndex, questions = []) {
  const lines = [`Week ${weekIndex + 1}`];
  meetings.forEach((meeting, index) => {
    const names = meeting.map((associate) => associate.name);
    const separator = names.length > 2 ? ", " : " & ";
    lines.push(`${index + 1}. ${names.join(separator)}`);
  });
  if (questions.length > 0) {
    lines.push("", "Ice Breakers");
    questions.forEach((q, i) => lines.push(`${i + 1}. ${q}`));
  }
  return lines.join("\n");
}

export function renderCopyWeek(container) {
  const button = makeFilterButton("Copy Week", async () => {
    const text = formatWeek(
      getCurrentMeetings(),
      getWeekIndex(),
      getCurrentWeek()?.questions,
    );
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
