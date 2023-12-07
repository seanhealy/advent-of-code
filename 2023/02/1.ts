import { readFileSync } from "fs";
import { join } from "path";

// const input = readFileSync(join(__dirname, "test-input.txt"), "utf-8");
const input = readFileSync(join(__dirname, "input.txt"), "utf-8");
const lines = input.trim().split("\n");

const availableColors: Record<string, number> = {
  red: 12,
  green: 13,
  blue: 14,
};

const games = lines.map((line) => parseGame(line));
type Game = (typeof games)[number];

const gamesMax = games.map(maxColors);
type GameMax = (typeof gamesMax)[number];

const possibleGames = gamesMax.map(gamePossible);

console.log(possibleGames.reduce((count, id) => count + id, 0));

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

function gamePossible({ id, colorsMax }: GameMax): number {
  const notPossible = Object.entries(colorsMax).some(([color, count]) => {
    const availableColor = availableColors[color] ?? 0;
    return availableColor < count;
  });

  if (notPossible) return 0;
  return id;
}
