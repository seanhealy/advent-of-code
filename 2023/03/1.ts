import { readFileSync } from "fs";
import { join } from "path";

const input = readFileSync(join(__dirname, "test-input.txt"), "utf-8");
// const input = readFileSync(join(__dirname, "input.txt"), "utf-8");
const grid = input
  .trim()
  .split("\n")
  .map((line) => line.split(""));

type Location = [x: number, y: number];
interface Digit {
  int: number;
  adjacent: boolean;
  location: string;
}
type Number = Digit[];

const numbers = getNumbers();

console.log(
  numbers
    .filter(partNumber)
    .map(numberToInt)
    .reduce((sum, int) => sum + int, 0)
);

function getNumbers(): Number[] {
  const numbers: Number[] = [];
  let number: Digit[] = [];

  grid.forEach((row, y) =>
    row.forEach((cell, x) => {
      const int = parseInt(cell, 10);
      if (!Number.isNaN(int)) {
        number.push({
          int,
          adjacent: symbolAdjacent([x, y]),
          location: [x, y].join(),
        });
      } else {
        if (number.length) numbers.push(number);
        number = [];
      }
    })
  );

  return numbers;
}

function symbolAdjacent([x, y]: Location) {
  const range = [-1, 0, 1];

  return range.some((xMod) =>
    range.some((yMod) => symbolAtLocation([x + xMod, y + yMod]))
  );
}

function symbolAtLocation([x, y]: Location): boolean {
  const characterAtLocation = grid[y]?.[x] ?? ".";

  return !!characterAtLocation.match(/[^\d\.]/);
}

function partNumber(number: Number): boolean {
  return number.some((digit) => digit.adjacent);
}

function numberToInt(number: Number): number {
  return parseInt(number.map(({ int }) => int).join(""), 10);
}
