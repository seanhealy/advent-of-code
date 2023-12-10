import { readAsLines } from "../../utils/files";

// const lines = readAsLines(__dirname, "test-input.txt");
const lines = readAsLines(__dirname, "input.txt");

const totalTime = +(
  lines[0].match(/^\w+:\s+([\d\s]+)$/)?.[1].replaceAll(/\s+/g, "") ?? ""
);
const goalDistance = +(
  lines[1].match(/^\w+:\s+([\d\s]+)$/)?.[1].replaceAll(/\s+/g, "") ?? ""
);

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

console.log(ways);
