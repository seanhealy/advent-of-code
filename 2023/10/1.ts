import { readAsLines } from "../../utils/files";

const lines = readAsLines(__dirname, "test-input.txt");
// const lines = readAsLines(__dirname, "input.txt");

const grid = lines.map((line) => line.split(""));

const width = grid[0].length;
const height = grid.length;

type Cell = readonly [x: number, y: number];

renderGrid(grid);

let start: Cell = [-1, -1];

grid.some((row, y) => {
  return row.some((cellChar: string, x) => {
    if (cellChar === "S") {
      start = [x, y];
      return true;
    }
  });
});

console.log("---");
console.log({ start });
console.log("---");

const heatmap: number[][] = new Array(height);
for (let index = 0; index < height; index++) {
  heatmap[index] = new Array(width).fill(undefined);
}

const directions = {
  up: [0, -1],
  down: [0, 1],
  right: [1, 0],
  left: [-1, 0],
} as const;

const connectors = {
  ".": { to: [], from: [] },
  S: {
    to: [directions.up, directions.down, directions.left, directions.right],
    from: [],
  },
  "-": {
    to: [directions.left, directions.right],
    from: [directions.left, directions.right],
  },
  "|": {
    to: [directions.up, directions.down],
    from: [directions.up, directions.down],
  },
  "7": {
    to: [directions.left, directions.down],
    from: [directions.right, directions.up],
  },
  F: {
    to: [directions.right, directions.down],
    from: [directions.left, directions.up],
  },
  J: {
    to: [directions.left, directions.up],
    from: [directions.right, directions.down],
  },
  L: {
    to: [directions.right, directions.up],
    from: [directions.left, directions.down],
  },
} as const;

let maxDepth = 0;
updateHeatMapBFS(start);
renderGrid(heatmap);
console.log({ maxDepth });

// function updateHeatMapDFS(cellPosition: Cell, depth = 0) {
//   const cell = getCell(cellPosition);
//   writeToHeatMap(cellPosition, depth);

//   connectors[cell].to.forEach((direction) => {
//     const nextCellPosition = getCellInDirection(cellPosition, direction);
//     const nextCell = getCell(nextCellPosition);

//     if (getHeatMap(nextCellPosition) === undefined) {
//       if (
//         // @ts-ignore
//         connectors[nextCell].from.includes(direction)
//       ) {
//         updateHeatMap(nextCellPosition, depth + 1);
//       }
//     }
//   });
// }

function updateHeatMapBFS(startCellPosition: Cell) {
  const queue: { position: Cell; depth: number }[] = [];
  queue.push({ position: startCellPosition, depth: 0 });

  let next: { position: Cell; depth: number } | undefined;
  while ((next = queue.shift())) {
    const { position, depth } = next;
    const cell = getCell(position);

    if (getHeatMap(position) === undefined) {
      writeToHeatMap(position, depth);

      connectors[cell].to.forEach((direction) => {
        const nextCellPosition = getCellInDirection(position, direction);
        const nextCell = getCell(nextCellPosition);

        if (
          // @ts-ignore
          connectors[nextCell].from.includes(direction) &&
          getHeatMap(nextCellPosition) === undefined
        ) {
          queue.push({ position: nextCellPosition, depth: depth + 1 });
        }
      });
    }
  }
}

function getCellInDirection([x, y]: Cell, [x0, y0]: Cell) {
  return [x + x0, y + y0] as Cell;
}

function getCell([x, y]: Cell) {
  return grid[y][x] as "." | "S" | "-" | "|" | "7" | "F" | "J" | "L";
}

function getHeatMap([x, y]: Cell) {
  return heatmap[y][x];
}

function writeToHeatMap([x, y]: Cell, value: number) {
  maxDepth = Math.max(maxDepth, value);
  if (getHeatMap([x, y]) === undefined) heatmap[y][x] = value;
}

function renderGrid(grid: (number | string)[][]) {
  grid.forEach((row) => {
    console.log(
      row
        .map((cell) => {
          return String(cell === "." || cell === undefined ? "·" : cell)
            .replace("F", "┌")
            .replace("L", "└");
        })
        .join(" ")
    );
  });
}
