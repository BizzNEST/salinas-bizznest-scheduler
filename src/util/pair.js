import { internPairsSet } from "../constants/constants.js";

export default function pair(arr) {
  const pairsArray = []; //return array with the pairings

  if (arr.length <= 1) {
    return pairsArray;
  }

  const arrLast = arr.length - 1;

  //iterate by twos, create item tuples and add then to return array
  for (let i = 0; i < arrLast; i += 2) {
    const pair = [arr[i], arr[i + 1]];
    pairsArray.push(pair);
    internPairsSet.add(pair);
  }

  //if odd then add last item to last pair
  if (arr.length % 2 !== 0) {
    internPairsSet.delete(pairsArray[pairsArray.length - 1]);
    pairsArray[pairsArray.length - 1].push(arr[arrLast]);
    internPairsSet.add(pairsArray[pairsArray.length - 1]);
  }

  console.log(pairsArray);

  //internPairs = await pairsArray;

  return internPairsSet;
}
