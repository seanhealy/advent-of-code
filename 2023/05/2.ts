import { join } from "path";
import { read } from "../../utils/files";
import { Worker } from "worker_threads";
import { Map, MapRow } from "./types";
import { WorkerData } from "./mapSeedRange";

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

const pairs = groupIntoPairs(
  input
    .match(/seeds: ((?:\d+ ?)+)/)?.[1]
    .split(/\s/)
    .map((value) => parseInt(value, 10)) ?? [NaN]
);

run();

async function run() {
  console.log(pairs);
  console.log("Total Pairs:", pairs.length);

  const pairMin = await Promise.all(
    pairs.map(async (pair, pairIndex) => {
      return await runInWorker({ pair, pairIndex, maps });
    })
  );

  console.log(Math.min(...pairMin));
}

function runInWorker(workerData: WorkerData): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const worker = new Worker(join(__dirname, "./mapSeedRange.js"));

    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });

    worker.postMessage(workerData);
  });
}

function groupIntoPairs<T>(arr: T[]): [T, T][] {
  const pairs: T[][] = [];

  for (let i = 0; i < arr.length; i += 2) {
    pairs.push(arr[i + 1] !== undefined ? [arr[i], arr[i + 1]] : [arr[i]]);
  }

  return pairs as [T, T][];
}
