import { readAsLines } from "../../utils/files";
import { add } from "../../utils/math";

// const lines = readAsLines(__dirname, "test-input.txt");
const lines = readAsLines(__dirname, "input.txt");

const originalWidth = lines[0].length;
const originalHeight = lines.length;

const blankRow = new Array(lines[0].length).fill(".").join("");
lines.push(blankRow);
lines.unshift(blankRow);

const smallGrid = lines.map((line) => `.${line}.`.split(""));

const directions = {
  up: [0, -1],
  down: [0, 1],
  right: [1, 0],
  left: [-1, 0],
} as const;

const grid: string[][] = [];
smallGrid.forEach((row, y) => {
  const expandedRow: string[] = [];
  const expandedNextRow: string[] = [];

  row.forEach((cell, x) => {
    expandedRow.push(cell);
    const nextCellPosition = getCellInDirection(
      [x, y],
      directions.right,
      smallGrid
    );
    if (
      nextCellPosition &&
      ["S", "F", "-", "L"].includes(cell) &&
      ["S", "7", "-", "J"].includes(getCell(nextCellPosition, smallGrid) ?? ".")
    ) {
      expandedRow.push("-");
    } else {
      expandedRow.push(".");
    }
  });

  expandedRow.forEach((cell, x) => {
    const nextCellPosition = getCellInDirection(
      [Math.floor(x / 2), y],
      directions.down,
      smallGrid
    );
    if (
      nextCellPosition &&
      ["S", "F", "|", "7"].includes(cell) &&
      ["S", "L", "|", "J"].includes(getCell(nextCellPosition, smallGrid) ?? ".")
    ) {
      expandedNextRow.push("|");
    } else {
      expandedNextRow.push(".");
    }
  });

  grid.push(expandedRow);
  grid.push(expandedNextRow);
});

const width = grid[0].length;
const height = grid.length;

type Cell = readonly [x: number, y: number];

let start: Cell = [-1, -1];

grid.some((row, y) => {
  return row.some((cellChar: string, x) => {
    if (cellChar === ".") {
      start = [x, y];
      return true;
    }
  });
});

const heatmap: number[][] = new Array(height);
for (let index = 0; index < height; index++) {
  heatmap[index] = new Array(width).fill(undefined);
}

const connectors = {
  ".": {
    to: [directions.up, directions.down, directions.left, directions.right],
    floods: [directions.up, directions.down, directions.left, directions.right],
  },
  S: {
    to: [directions.up, directions.down, directions.left, directions.right],
    floods: [directions.up, directions.down, directions.left, directions.right],
  },
  "-": {
    to: [directions.left, directions.right],
    floods: [directions.up, directions.down],
  },
  "|": {
    to: [directions.up, directions.down],
    floods: [directions.left, directions.right],
  },
  "7": {
    to: [directions.left, directions.down],
    floods: [directions.right, directions.up],
  },
  F: {
    to: [directions.right, directions.down],
    floods: [directions.left, directions.up],
  },
  J: {
    to: [directions.left, directions.up],
    floods: [directions.right, directions.down],
  },
  L: {
    to: [directions.right, directions.up],
    floods: [directions.left, directions.down],
  },
} as const;

updateHeatMapBFS(start);

renderGrid(smallGrid);
console.log("---");
renderGrid(grid);
console.log("---");
renderGrid(heatmap);
console.log("---");
const collapsedHeatmap = collapseGrid(heatmap);
renderGrid(collapsedHeatmap);
console.log("---");
console.log(
  (originalHeight + 2) * (originalWidth + 2) -
    add(collapsedHeatmap.map((row) => row.join("").length))
);

function updateHeatMapBFS(startCellPosition: Cell, squeezing = false) {
  const queue: { position: Cell; depth: number }[] = [];
  queue.push({ position: startCellPosition, depth: 0 });

  let next: { position: Cell; depth: number } | undefined;
  while ((next = queue.shift())) {
    const { position, depth } = next;
    const cell = getCell(position, grid);

    if (getHeatMap(position) === undefined) {
      writeToHeatMap(position, 1);

      connectors[cell].to.forEach((direction) => {
        const nextCellPosition = getCellInDirection(position, direction, grid);

        if (nextCellPosition && getHeatMap(nextCellPosition) === undefined) {
          queue.push({ position: nextCellPosition, depth: depth + 1 });
        }
      });
    }
  }
}

function getCellInDirection(
  [x, y]: Cell,
  [x0, y0]: Cell,
  gridToUse: unknown[][]
) {
  const cell = [x + x0, y + y0] as Cell;

  if (
    cell[0] >= 0 &&
    cell[0] < gridToUse[0].length &&
    cell[1] >= 0 &&
    cell[1] < gridToUse.length
  ) {
    return cell;
  }
  return undefined;
}

function getCell([x, y]: Cell, grid: string[][]) {
  return grid[y][x] as "." | "S" | "-" | "|" | "7" | "F" | "J" | "L";
}

function getHeatMap([x, y]: Cell) {
  return heatmap[y][x];
}

function writeToHeatMap([x, y]: Cell, value: number) {
  if (getHeatMap([x, y]) === undefined) heatmap[y][x] = value;
}

function renderGrid(grid: (number | string)[][]) {
  grid.forEach((row) => {
    console.log(
      row
        .map((cell) => {
          return String(cell === "." || cell === undefined ? "·" : cell)
            .replace("F", "┌")
            .replace("L", "└")
            .replace("J", "┘")
            .replace("7", "┐")
            .replace("|", "│")
            .replace("-", "─")
            .replace("1", " ");
        })
        .join("")
    );
  });
}

function collapseGrid<T>(grid: T[][]) {
  const newGrid: T[][] = [];

  for (let rowIndex = 0; rowIndex < grid.length / 2; rowIndex++) {
    const row = grid[rowIndex * 2];
    const newRow: T[] = [];

    for (let cellIndex = 0; cellIndex < row.length / 2; cellIndex++) {
      const cell = row[cellIndex * 2];
      newRow.push(cell);
    }

    newGrid.push(newRow);
  }

  return newGrid;
}
