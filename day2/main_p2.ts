import { inputParser } from "../utils.ts";
import input from "./input.ts";

const parsedInput = inputParser(input, ",");
const patternMatchRegex = /^(.+?)\1+$/;

let acc = 0;

for (const id of parsedInput) {
  const [idStart, idEnd] = id.split("-").map(Number);

  for (let nbr = idStart; nbr <= idEnd; nbr++) {
    const nbrStr = nbr.toString();
    const match = nbrStr.match(patternMatchRegex);

    acc += match ? nbr : 0;
  }
}

console.log("Accumulated sum of repeated patterns:", acc);
