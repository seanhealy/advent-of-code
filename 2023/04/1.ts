import { readAsLines } from "../../utils/files";
import { add } from "../../utils/math";

// const lines = readAsLines(__dirname, "test-input.txt");
const lines = readAsLines(__dirname, "input.txt");

console.log(
  add(
    lines.map((line) => {
      const { winning, have } = parseCard(line);
      return Math.floor(Math.pow(2, intersection(winning, have).length - 1));
    })
  )
);

function parseCard(cardString: string) {
  const [, cardNumber, winning = "", have = ""] =
    cardString.match(/^Card\s+(\d+):\s*([\d\s]+)\s+\|\s*([\d\s]+)$/) ?? [];

  return { cardNumber, winning: winning.split(/\s+/), have: have.split(/\s+/) };
}

function intersection<T>(array1: T[], array2: T[]): T[] {
  const set1 = new Set(array1);
  return array2.filter((item) => set1.has(item));
}
