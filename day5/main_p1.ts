import { inputParser } from "../utils.ts";
import input from "./input.ts";

const [ranges, ids] = inputParser(input, "\n\n");

const idsOkSet = ranges.split("\n").reduce((acc, range) => {
  const [start, end] = range.split("-").map(Number);

  for (const id of ids.split("\n")) {
    const numId = Number(id);
    if (numId >= start && numId <= end) {
      acc.add(numId);
    }
  }

  return acc;
}, new Set<number>());

console.log("Number of valide ids:", idsOkSet.size);
