import { readFileSync } from "fs";
import { join } from "path";

const input = readFileSync(join(__dirname, "input.txt"), "utf-8");
const lines = input.split("\n");

const digits = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];
const digitsMap = Object.fromEntries(digits.map((key, value) => [key, value]));

const digitExtractor = `\\d|${digits.join("|")}`;
const firstExtractor = new RegExp(`^.*?(${digitExtractor}).*$`);
const secondExtractor = new RegExp(`^.*(${digitExtractor}).*?$`);

const sum = lines.reduce((sum, line) => {
  const first = getValue(line.match(firstExtractor)?.[1]);
  const second = getValue(line.match(secondExtractor)?.[1]);

  return sum + first * 10 + second;
}, 0);

console.log(sum);

function getValue(match: string = ""): number {
  return (parseInt(match, 10) || digitsMap[match]) ?? 0;
}
