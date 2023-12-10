import { join } from "path";
import { read } from "../../utils/files";
import { Worker } from "worker_threads";
import { Map, MapRow } from "./types";

type SeedRange = [start: number, end: number];

const mapExtractor = /[\w-]+ map:\n([\d\s]+)/g;

// const input = read(__dirname, "test-input.txt");
const input = read(__dirname, "input.txt");

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

const seedRanges: SeedRange[] = groupIntoPairs(
  input
    .match(/seeds: ((?:\d+ ?)+)/)?.[1]
    .split(/\s/)
    .map((value) => parseInt(value, 10)) ?? [NaN]
).map(([start, length]) => [start, start + length]);

async function* seedGenerator() {
  for (const [start, end] of seedRanges) {
    console.log("Starting A Range");
    for (let index = start; index < end; index++) {
      yield index;
    }
  }
}
const seeds = seedGenerator();

const numWorkers = 9;
const workers: Worker[] = [];
for (let i = 0; i < numWorkers; i++) {
  workers.push(new Worker(join(__dirname, "mapSeed.js")));
}

let minSeed = Number.MAX_SAFE_INTEGER;
run();

async function run() {
  await Promise.all(workers.map((worker, index) => runWorker(worker, index)));

  console.log({ minSeed });
  process.exit(0);
}

function runWorker(worker: Worker, workerIndex: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    worker.on("message", (result) => {
      minSeed = Math.min(minSeed, result);
      processNextSeed();
    });
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });

    processNextSeed();

    function processNextSeed() {
      seeds.next().then((seed) => {
        if (seed.done) {
          resolve();
        } else {
          worker.postMessage({ seed: seed.value, maps, workerIndex });
        }
      });
    }
  });
}

function groupIntoPairs<T>(arr: T[]): [T, T][] {
  const pairs: T[][] = [];

  for (let i = 0; i < arr.length; i += 2) {
    pairs.push(arr[i + 1] !== undefined ? [arr[i], arr[i + 1]] : [arr[i]]);
  }

  return pairs as [T, T][];
}
