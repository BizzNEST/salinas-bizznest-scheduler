import { getPlan, getCurrentMeetings } from "./plan.js";

// Build the CSV header line for the widest group in a set of meetings
function meetingsHeader(meetings) {
  // Every group has at least 2 associate slots in the header
  let maxAssociates = 2;
  for (const meeting of meetings) {
    if (meeting.length > maxAssociates) {
      maxAssociates = meeting.length;
    }
  }

  let header =
    "Group, (Associate 1) Name, (Associate 1) Department, (Associate 1) Location, (Associate 2) Name, (Associate 2) Department, (Associate 2) Location";
  //If any group has more than 2 associates extend the header to match
  for (let i = 3; i <= maxAssociates; i++) {
    header =
      header +
      `, (Associate ${i}) Name, (Associate ${i}) Department, (Associate ${i}) Location`;
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
    for (const associate of meeting) {
      csvrow.push(
        `${associate.name}, ${associate.department}, ${associate.location} `,
      );
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
  temp_link.download = "AssociatePairs.csv";
  const url = window.URL.createObjectURL(CSVFile);
  temp_link.href = url;

  // This link should not be displayed
  temp_link.style.display = "none";
  document.body.appendChild(temp_link);

  // Automatically click the link to trigger download
  temp_link.click();
  document.body.removeChild(temp_link);
}
