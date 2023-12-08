import { readAsLines } from "../../utils/files";
import { add } from "../../utils/math";

// const lines = readAsLines(__dirname, "test-input.txt");
const lines = readAsLines(__dirname, "input.txt");

const cardCounts = new Array(lines.length).fill(1);
const cardScores = lines.map(parseCard);

cardScores.forEach((score, index) => {
  for (
    let cardNumber = index + 1;
    cardNumber < score + index + 1;
    cardNumber++
  ) {
    cardCounts[cardNumber] += 1 * cardCounts[index];
  }
});

console.log(add(cardCounts));

function parseCard(cardString: string) {
  const [, winning = "", have = ""] =
    cardString.match(/^Card\s+\d+:\s*([\d\s]+)\s+\|\s*([\d\s]+)$/) ?? [];

  return intersection(winning.split(/\s+/), have.split(/\s+/)).length;
}

function intersection<T>(array1: T[], array2: T[]): T[] {
  const set1 = new Set(array1);
  return array2.filter((item) => set1.has(item));
}
