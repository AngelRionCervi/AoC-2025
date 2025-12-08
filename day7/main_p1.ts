import input from "./input.ts";
import { inputParser } from "../utils.ts";

const lines = inputParser(input);

const [firstLine, ...otherLines] = lines;
const sourceIndex = firstLine.indexOf("S");

let splittedTimes = 0;
const beamIndexes: Set<number> = new Set([sourceIndex]);

for (const line of otherLines) {
  beamIndexes.forEach((beamIndex) => {
    if (line[beamIndex] === "^") {
      splittedTimes++;
      beamIndexes.delete(beamIndex);
      beamIndexes.add(beamIndex - 1);
      beamIndexes.add(beamIndex + 1);
    }
  });
}

console.log("Total splitted times:", splittedTimes);
