import { readFileSync } from "fs";
import { join } from "path";

const input = readFileSync(join(__dirname, "input.txt"), "utf-8");
const lines = input.split("\n");

const sum = lines.reduce((sum, line) => {
  const first = line.match(/^.*?(\d).*$/)?.[1] ?? 0;
  const second = line.match(/^.*(\d).*?$/)?.[1] ?? 0;

  return sum + parseInt([first, second].join(""), 10);
}, 0);

console.log(sum);
