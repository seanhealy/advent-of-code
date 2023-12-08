import { read } from "../../utils/files";

type MapRow = [number, number, number];
type Map = MapRow[];

const mapExtractor = /[\w-]+ map:\n([\d\s]+)/g;

// const input = read(__dirname, "test-input.txt");
const input = read(__dirname, "input.txt");

const seeds: number[] = input
  .match(/seeds: ((?:\d+ ?)+)/)?.[1]
  .split(/\s/)
  .map((value) => parseInt(value, 10)) ?? [NaN];

let match;
const maps: Map[] = [];
while ((match = mapExtractor.exec(input)) !== null) {
  const rows = match[1].trim().split("\n");
  maps.push(
    rows.map(
      (row) => row.split(" ").map((number) => parseInt(number, 10)) as MapRow
    )
  );
}

console.log(
  Math.min(
    ...seeds.map((seed) =>
      maps.reduce((seed, map) => {
        return doMapping(seed, map);
      }, seed)
    )
  )
);

function doMapping(seed: number, map: Map): number {
  const row = map.find(
    ([destinationStart, rangeStart, length]) =>
      seed >= rangeStart && seed <= rangeStart + length
  );

  if (row) {
    const [destinationStart, rangeStart, length] = row;
    const offset = seed - rangeStart;
    return destinationStart + offset;
  }

  return seed;
}
