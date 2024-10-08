console.log("this is my filter test")

export function filterByLocation(interns) {
    const selected = new Set(getSelectedOptions().Location);
    return selected.size === 0
      ? interns
      : interns.filter((intern) => selected.has(intern.location));

function filterbyLocation(interns){
    const pair =[];

    for (let i = 0; i < interns.lenght; i++){
        for(let j = i+1; j< interns.lentgh; j++){
            if (interns[i].location == interns[j].location){
                pair.push([interns[i], interns[j]]);
        }
    }
    return pairs; 
}
functionCountSameLocationPairs(pairs){
    let count = 0;
    pairs.forEach(pair =>{
        if(pair.lenght === 2) {
            const [j,i] = pair; 
            if (j.location === i.location) {
                count ++;
            }
        }
    });
    return count
}

const pairs = pairInterns(interns);
const count = countSameLocation(pairs)

console.log('Number of pairs in the same location: ${count}'); 
console.log("Paired Interns:", pairs); 