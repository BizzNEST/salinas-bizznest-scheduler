import getInterns from "../../api/interns/service.js";
import { getSelectedOptions, isValidPair } from "../filters.js";
import interns from "../../documents/interns.json" assert {type: 'json'};
console.log(interns);

// async function pairInterns() {
//   let interns = [];
//   const departments = await getInterns();
//   for (const department in departments) {
//     for (const [intern, internInfo] of Object.entries(
//       departments[department],
//     )) {
//       interns.push({
//         name: intern,
//         department: internInfo.department,
//         location: internInfo.location,
//       });
//     }
//   }

//   shuffle(interns);
//   uniquePairing(interns);
//   return pair(interns);
// }

// function selectedOptions() {
//   const selected = ["Unique Departments"];

//   let deptPairing = selected.includes("Unique Departments");
//   let locPairing = selected.includes("Unique Locations");

//   return deptPairing, locPairing;
// }

// export default function uniquePairingTest() {
//   let count = 0;
//   let deptPairing,
//     locPairing = selectedOptions();
//   const pairs = pairInterns();

//   pairs.forEach((pair) => {
//     if (pair.length === 2) {
//       const [intern1, intern2] = pair;

//       if (isValidPair(intern1, intern2, deptPairing, locPairing)) {
//         count++;
//       }
//     }
//   });

//   const num_pairs = pairs.length;
//   console.log(count / num_pairs);
// }

uniquePairingTest();
