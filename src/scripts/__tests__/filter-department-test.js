import getInterns from "../api/interns/service.js";
import shuffle from "../util/shuffle.js";
import pair from "../util/pair.js";
import { filterByLocation, uniquePairing } from "./filters.js";
import { filterByDepartment, getSelectedOptions } from "./filters.js";
