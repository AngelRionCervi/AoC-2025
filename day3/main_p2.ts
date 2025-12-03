import { inputParser } from "../utils.ts";
import input from "./input.ts";

const parsedInput = inputParser(input);
const PACK_LENGTH = 12;

let totalJolts = 0;

function getBestDigitForSection(line: string, start: number, end: number): [number, number] {
  return line
    .slice(start, end)
    .split("")
    .reduce(
      ([bestD, bestI], curr, idx) => {
        const d = Number(curr);
        if (d > bestD) {
          return [d, start + idx];
        }
        return [bestD, bestI];
      },
      [0, start],
    );
}

for (const line of parsedInput) {
  let lineStart = 0;
  let lineResult = "";

  for (let i = 0; i < PACK_LENGTH; i++) {
    const remaining = PACK_LENGTH - (i + 1);

    if (remaining + lineStart === line.length) {
      lineResult += line.slice(lineStart, line.length);
      break;
    }

    const lineEnd = line.length - remaining;

    const [bestDigit, bestIndex] = getBestDigitForSection(line, lineStart, lineEnd);

    lineResult += bestDigit;
    lineStart = bestIndex + 1;
  }

  totalJolts += Number(lineResult);
}

console.log("Total accumulated jolts (12 digits):", totalJolts);
