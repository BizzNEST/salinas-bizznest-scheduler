export const filters = [
  {
    name: "Location",
    options: ["Salinas", "Watsonville", "Gilroy", "Modesto", "Stockton"],
  },
  {
    name: "Departments",
    options: [
      "Web Development",
      "Design",
      "Video Production",
      "IT",
      "Marketing",
    ],
  },
  {
    name: "Unique Pairing",
    options: ["Unique Locations", "Unique Departments"],
  },
];

export const locationEmojiMap = {
  Salinas: "🥗",
  Watsonville: "🍓",
  Gilroy: "🧄",
  Modesto: "🐮",
  Stockton: "🍒",
};

export const internsSet = new Set();

export const mailToMessageObject = {
  subject: "Hello 👋, We've been paired to NEST Meet!",
  body: "Hey! We've been paired up to meet, Let me know what day and time works best for you!",
};
