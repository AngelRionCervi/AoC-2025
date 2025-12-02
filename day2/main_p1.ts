import { inputParser } from "../utils.ts";
import input from "./test_input.ts";

const parsedInput = inputParser(input, ",");
const patternMatchRegex = /(.+)\1+/;

let acc = 0;

for (const id of parsedInput) {
  const [idStart, idEnd] = id.split("-").map(Number);

  for (let nbr = idStart; nbr <= idEnd; nbr++) {
    const nbrStr = nbr.toString();
    const match = nbrStr.match(patternMatchRegex);

    if (match && match[0] === nbrStr && match[0].length / 2 === match[1].length) {
      acc += Number(match[0]);
    }
  }
}

console.log("Accumulated sum of repeated patterns:", acc);
