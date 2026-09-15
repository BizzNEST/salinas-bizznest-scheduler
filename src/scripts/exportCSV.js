import { getPlan, getCurrentMeetings } from "./plan.js";

// Build the CSV header line for the widest group in a set of meetings
function meetingsHeader(meetings) {
  // Every group has at least 2 intern slots in the header
  let maxInterns = 2;
  for (const meeting of meetings) {
    if (meeting.length > maxInterns) {
      maxInterns = meeting.length;
    }
  }

  let header =
    "Group, (Intern 1) Name, (Intern 1) Department, (Intern 1) Location, (Intern 2) Name, (Intern 2) Department, (Intern 2) Location";
  //If any group has more than 2 interns extend the header to match
  for (let i = 3; i <= maxInterns; i++) {
    header =
      header +
      `, (Intern ${i}) Name, (Intern ${i}) Department, (Intern ${i}) Location`;
  }
  return header;
}

// Convert an array of meetings into CSV rows (header + one row per group)
export function meetingsToCSVRows(meetings) {
  const rows = [];
  rows.push(meetingsHeader(meetings));

  for (let i = 0; i < meetings.length; i++) {
    const meeting = meetings[i];

    // First column is the group number
    const csvrow = [`Group ${i + 1}`];
    for (const intern of meeting) {
      csvrow.push(`${intern.name}, ${intern.department}, ${intern.location} `);
    }
    rows.push(csvrow.join(","));
  }
  return rows;
}

export function planToCSV() {
  const plan = getPlan();
  const weeks = plan?.weeks ?? [];

  let csv_data = [];
  for (let i = 0; i < weeks.length; i++) {
    // Delimit each week with a header line
    csv_data.push(`Week ${i + 1}`);
    const meetings = weeks[i].meetings ?? [];
    csv_data = csv_data.concat(meetingsToCSVRows(meetings));
    // Blank line between weeks for readability
    csv_data.push("");
  }

  downloadCSVFile(csv_data.join("\n"));
}

// Export only the currently selected week using the plan data
export function weekToCSV() {
  const meetings = getCurrentMeetings();
  downloadCSVFile(meetingsToCSVRows(meetings).join("\n"));
}

export function downloadCSVFile(csv_data) {
  // Create CSV file object and feed our
  // csv_data into it
  const CSVFile = new Blob([csv_data], { type: "text/csv" });

  // Create to temporary link to initiate
  // download process
  const temp_link = document.createElement("a");

  // Download csv file
  temp_link.download = "InternPairs.csv";
  const url = window.URL.createObjectURL(CSVFile);
  temp_link.href = url;

  // This link should not be displayed
  temp_link.style.display = "none";
  document.body.appendChild(temp_link);

  // Automatically click the link to trigger download
  temp_link.click();
  document.body.removeChild(temp_link);
}
