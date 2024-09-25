import swap from "./swap.js";
import getRandomIntInclusive from "./getRandomIntInclusive.js";

export default function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; --i) {
    const randomIndex = getRandomIntInclusive(0, i);
    swap(arr, randomIndex, i);
  }
}
