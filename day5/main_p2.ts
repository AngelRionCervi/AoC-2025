import { inputParser } from "../utils.ts";
import input from "./input.ts";

const [ranges] = inputParser(input, "\n\n");
const rangesArr = ranges.split("\n");

function normalizeRange(rangeToMod: string, rangeToCheck: string): string {
  const [start1, end1] = rangeToMod.split("-").map(Number);
  const [start2, end2] = rangeToCheck.split("-").map(Number);

  const isOverlapping = start2 <= end1 && end2 >= start1;

  if (isOverlapping) {
    const newStart = Math.min(start1, start2);
    const newEnd = Math.max(end1, end2);

    return `${newStart}-${newEnd}`;
  }

  return rangeToMod;
}

const normalizedRanges: string[] = rangesArr;

// iterating over ranges^2 could be avoided if the ranges were sorted first
for (let i = 0; i < rangesArr.length * rangesArr.length; i++) {
  const rangeIndex = i % rangesArr.length;
  let normalizedRange = rangesArr[rangeIndex];

  for (const rangeToCheck of normalizedRanges) {
    normalizedRange = normalizeRange(normalizedRange, rangeToCheck);
  }

  normalizedRanges[rangeIndex] = normalizedRange;
}

const uniqueNormalizedRanges = new Set(normalizedRanges);

const okIds = [...uniqueNormalizedRanges].reduce((acc, range) => {
  const [start, end] = range.split("-").map(Number);

  return acc + (end - start + 1);
}, 0);

console.log("Number of valide ids:", okIds);
