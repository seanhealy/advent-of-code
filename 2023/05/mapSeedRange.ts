import { parentPort } from "worker_threads";
import { Map } from "./types";

export interface WorkerData {
  pair: number[];
  pairIndex: number;
  maps: Map[];
}

parentPort?.on(
  "message",
  ({ pair: [start, length], pairIndex, maps }: WorkerData) => {
    console.log("Starting Pair", pairIndex);

    let minSeed = Number.MAX_SAFE_INTEGER;

    for (var index = start; index < start + length - 1; index++) {
      minSeed = Math.min(
        minSeed,
        maps.reduce(function (seed, map) {
          return doMapping(seed, map);
        }, index)
      );
    }

    console.log("Finished Pair", pairIndex, minSeed);

    parentPort?.postMessage(minSeed);
    parentPort?.close();
  }
);

function doMapping(seed: number, map: Map): number {
  const row = map.find(
    ([destinationStart, rangeStart, length]) =>
      seed >= rangeStart && seed <= rangeStart + length - 1
  );

  if (row) {
    const [destinationStart, rangeStart, length] = row;
    const offset = seed - rangeStart;
    return destinationStart + offset;
  }

  return seed;
}
