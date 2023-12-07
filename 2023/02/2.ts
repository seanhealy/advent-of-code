import { readFileSync } from "fs";
import { join } from "path";

// const input = readFileSync(join(__dirname, "test-input.txt"), "utf-8");
const input = readFileSync(join(__dirname, "input.txt"), "utf-8");
const lines = input.trim().split("\n");

const games = lines.map((line) => parseGame(line));
type Game = (typeof games)[number];

const gamesMax = games.map(maxColors);
type GameMax = (typeof gamesMax)[number];

console.log(
  gamesMax
    .map(({ colorsMax }) =>
      Object.values(colorsMax).reduce((total, number) => total * number, 1)
    )
    .reduce((total, number) => total + number, 0)
);

function parseGame(line: string) {
  const [, id, gameData] = line.match(/^Game (\d+): (.*)$/) ?? [];

  const drawings = gameData.split("; ").map((drawing) => {
    return drawing.split(", ").map(parseColor);
  });

  return { id: parseInt(id, 10), drawings };
}

function parseColor(numberOfColor: string): { number: number; color: string } {
  const [, number, color] = numberOfColor.match(/^(\d+) (\w+)$/) ?? [];
  return { number: parseInt(number, 10), color };
}

function maxColors({ id, drawings }: Game): {
  id: number;
  colorsMax: Record<string, number>;
} {
  const colorsMax: Record<string, number> = {};

  drawings.forEach((drawing) => {
    drawing.forEach(({ color, number }) => {
      colorsMax[color] = Math.max(colorsMax[color] ?? 0, number);
    });
  });

  return { id, colorsMax };
}
