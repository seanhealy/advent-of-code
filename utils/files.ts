import { readFileSync } from "fs";
import { join } from "path";

export function read(dir: string, file: string) {
  const input = readFileSync(join(dir, file), "utf-8");
  return input.trim();
}

export function readAsLines(dir: string, file: string) {
  return read(dir, file).split("\n");
}
