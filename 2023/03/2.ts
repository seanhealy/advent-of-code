import { readFileSync } from "fs";
import { join } from "path";

// const input = readFileSync(join(__dirname, "test-input.txt"), "utf-8");
const input = readFileSync(join(__dirname, "input.txt"), "utf-8");
const grid = input
  .trim()
  .split("\n")
  .map((line) => line.split(""));

type Location = `${number},${number}`;
interface Number {
  int: number;
  adjacentLocations: Location[];
}

type Gear = [number, number];

const numbers = getNumbers();
const gears = getGears();

console.log(
  gears
    .map(([number1, number2]) => number1 * number2)
    .reduce((sum, ratio) => sum + ratio, 0)
);

function getNumbers() {
  const numbers: Number[] = [];
  let number: Number = { int: 0, adjacentLocations: [] };

  grid.forEach((row, y) =>
    row.forEach((cell, x) => {
      const int = parseInt(cell, 10);
      if (!Number.isNaN(int)) {
        const firstDigit = !digitAtLocation(x - 1, y);
        const lastDigit = !digitAtLocation(x + 1, y);

        let sides: Location[] = [];
        const range = [-1, 0, 1];
        if (firstDigit) {
          sides = [
            ...sides,
            ...range.map((yMod) => `${x - 1},${y + yMod}`),
          ] as Location[];
        }
        if (lastDigit) {
          sides = [
            ...sides,
            ...range.map((yMod) => `${x + 1},${y + yMod}`),
          ] as Location[];
        }

        number = {
          int: number.int * 10 + int,
          adjacentLocations: [
            ...number.adjacentLocations,
            ...sides,
            `${x},${y - 1}`,
            `${x},${y + 1}`,
          ],
        };
      } else {
        if (number.int) numbers.push(number);
        number = { int: 0, adjacentLocations: [] };
      }
    })
  );

  return numbers;
}

function getGears(): Gear[] {
  const gears: Gear[] = [];

  grid.forEach((row, y) =>
    row.forEach((cell, x) => {
      if (cell === "*") {
        const adjacentNumbers = getAdjacentNumbers(x, y);
        if (adjacentNumbers.length === 2)
          gears.push(
            adjacentNumbers.map((adjacentNumber) => adjacentNumber.int) as Gear
          );
      }
    })
  );

  return gears;
}

function getAdjacentNumbers(x: number, y: number): Number[] {
  return numbers.filter((number) =>
    number.adjacentLocations.includes(`${x},${y}`)
  );
}

function digitAtLocation(x: number, y: number): boolean {
  return !Number.isNaN(parseInt(grid[y]?.[x] ?? "."));
}
