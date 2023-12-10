import { read } from "../../utils/files";
import { Worker } from "worker_threads";
import { WorkerData } from "./mapSeed";
import { join } from "path";

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

run();

async function run() {
  console.log("Total Seeds:", seeds.length);

  const seedMins = await Promise.all(
    seeds.map(async (seed, seedIndex) => {
      return await runInWorker({ seed, maps });
    })
  );

  console.log(Math.min(...seedMins));
}

function runInWorker(workerData: WorkerData): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const worker = new Worker(join(__dirname, "./mapSeed.js"));

    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });

    worker.postMessage(workerData);
  });
}
