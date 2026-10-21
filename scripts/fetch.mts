import { writeFileSync, mkdirSync } from "node:fs";
import { collect, todaySP } from "../src/lib/fetcher.ts";
const day = process.argv[2] || todaySP();
const d = await collect(day);
mkdirSync("data", { recursive: true });
writeFileSync(`data/${day}.json`, JSON.stringify(d, null, 2));
console.log(day, d.counts);
