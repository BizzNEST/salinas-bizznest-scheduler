export default function pair(arr) {
  const pairsArray = [];

  let num_pairs = Math.floor(arr.length / 2);
  //console.log(arr.length);

  for (let i = 0; i < arr.length; i += 2) {
    const pair = [arr[i], arr[i + 1]];
    pairsArray.push(pair);
  }
  //need to add conditions for odd number of interns
  //if odd, get last pair (index = num_pairs - 1) and add third person
  //also need to figure out how we want to display that

  //console.log(pairsArray);

  return pairsArray;
}
