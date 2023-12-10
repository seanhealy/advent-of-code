import { readAsLines } from "../../utils/files";

// const lines = readAsLines(__dirname, "test-input.txt");
const lines = readAsLines(__dirname, "input.txt");

const totalTimes = (
  lines[0].match(/^\w+:\s+([\d\s]+)$/)?.[1].split(/\s+/) ?? []
).map((value) => +value);
const goalDistances = (
  lines[1].match(/^\w+:\s+([\d\s]+)$/)?.[1].split(/\s+/) ?? []
).map((value) => +value);

let product = 1;

for (let raceIndex = 0; raceIndex < totalTimes.length; raceIndex++) {
  const totalTime = totalTimes[raceIndex];
  const goalDistance = goalDistances[raceIndex];

  let ways = 0;
  for (let time = 1; time < totalTime; time++) {
    const speed = totalTime - time;
    const distance = speed * time;

    if (distance > goalDistance) {
      ways++;
    } else {
      if (ways > 0) break;
    }
  }

  product = product * ways;
}

console.log(product);
