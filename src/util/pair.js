import isEven from "./isEven.js";

export default function pair(arr) {
  const pairs = []; //return array with the pairings

  if (arr.length <= 1) {
    return pairs;
  }

  const arrLast = arr.length - 1;

  //iterate by twos, create item tuples and add then to return array
  for (let i = 0; i < arrLast; i += 2) {
    const pair = [arr[i], arr[i + 1]];
    pairs.push(pair);
  }

  //if odd then add last item to last pair
  if (!isEven(arr.length)) {
    pairs[pairs.length - 1].push(arr[arrLast]);
  }

  return pairs;
}
