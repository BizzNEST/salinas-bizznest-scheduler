import getQuestions from "./scripts/getQuestions.js";
import shuffle from "./util/shuffle.js";

document.addEventListener("DOMContentLoaded", () => {
  const toggleIcon = document.getElementById("toggle-icon");
  const weekCardContent = document.getElementById("week-card-content");

  toggleIcon.addEventListener("click", () => {
    // Toggle the collapsed class to control max-height
    weekCardContent.classList.toggle("collapsed");

    // Toggle the chevron icon rotation
    toggleIcon.classList.toggle("rotate");
  });

  async function displayQuestions(amountOfQuestions = 2) {
    let questions = await getQuestions(); // fetch questions
    shuffle(questions); // shuffle them
    questions = questions.slice(0, Math.max(0, amountOfQuestions)); // get the amountOfQuestions
    const ol = document.getElementById("ice-breaker-questions");
    ol.innerHTML = ""; // Clear any existing questions
    for (const question of questions) {
      const li = document.createElement("li");
      li.textContent = question;
      ol.appendChild(li);
    }
  }

  displayQuestions();

  const generateButton = document.getElementById("card-header");

  const internPairs = {
    pairOne: {
      internA: {
        name: "SpongeBob Squarepants",
        department: "Web Development",
        location: "Salinas",
      },
      internB: {
        name: "Kim Possible",
        department: "Design",
        location: "Gilroy",
      },
    },

    pairTwo: {
      internA: {
        name: "Danny Phantom",
        department: "IT",
        location: "Watsonville",
      },
      internB: {
        name: "Luke Skywalker",
        department: "Film Production",
        location: "Modesto",
      },
    },
  };

  generateButton.addEventListener("click", function () {
    displayInternPairs(internPairs);
  });

  function displayInternPairs(pair) {
    const internPairsValues = Object.values(internPairs);

    let count = 0;
    const table = document.getElementById("interns-table");

    internPairsValues.forEach((pair) => {
      count++;
      const row = document.createElement("tr");

      const groupNum = document.createElement("td");
      groupNum.textContent = "Group " + count;

      const internA = organizeInternInfo(pair.internA);

      const internB = organizeInternInfo(pair.internB);

      row.appendChild(groupNum);
      row.appendChild(internA);
      row.appendChild(internB);

      table.appendChild(row);
    });

    function organizeInternInfo(intern) {
      const internA = document.createElement("td"); //Create column for first intern

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

      internA.appendChild(internInfo);

      return internA;
    }
  }
});
