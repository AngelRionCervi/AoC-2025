import input from "./input.ts";
import { inputParser, sum } from "../utils.ts";

const lines = inputParser(input);

const [firstLine, ...otherLines] = lines;

const columnScores = Array.from({ length: firstLine.length }, () => 0);
columnScores[firstLine.indexOf("S")] = 1;

for (let i = 0; i < otherLines.length; i++) {
  const line = otherLines[i];
  const splittersXIndexes = [...line.matchAll(/\^/g)].map((match) => match.index);

  for (const splitterIndex of splittersXIndexes) {
    if (columnScores[splitterIndex] > 0) {
      const newsScore = columnScores[splitterIndex];
      columnScores[splitterIndex + 1] += newsScore;
      columnScores[splitterIndex - 1] += newsScore;
      columnScores[splitterIndex] = 0;
    }
  }
}

const total = sum(columnScores);

console.log("Total nbr of paths:", total);
