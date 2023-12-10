import { parentPort } from "worker_threads";
import { Map } from "./types";

export interface WorkerData {
  seed: number;
  maps: Map[];
}

parentPort?.on("message", ({ seed, maps }: WorkerData) => {
  const result = maps.reduce((seed, map) => {
    return doMapping(seed, map);
  }, seed);

  parentPort?.postMessage(result);
  parentPort?.close();
});

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
