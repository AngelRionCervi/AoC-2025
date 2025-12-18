import input from "./input.ts";
import { inputParser } from "../utils.ts";

interface Command {
  indicator: number[];
  sequences: number[][];
}

const inputLines = inputParser(input);

const commands = inputLines.map<Command>((line) => {
  const match = line.match(/^\[(.+)\] (.+) \{(.+)\}$/);
  if (!match) throw new Error("Invalid input line: " + line);

  const indicator = match[1].split("").map((char) => (char === "#" ? 1 : 0));
  const sequences = match[2].split(" ").map((seq) => seq.slice(1, -1).split(",").map(Number));

  return { indicator, sequences };
});

function combinations(arr: number[][], r: number) {
  const result: number[][][] = [];

  function helper(start: number, combo: number[][]) {
    if (combo.length === r) {
      result.push([...combo]);
      return;
    }

    for (let i = start; i < arr.length; i++) {
      combo.push(arr[i]);
      helper(i + 1, combo);
      combo.pop();
    }
  }

  helper(0, []);
  return result;
}

function getFidelityScore(indicatorRef: number[], indicator: number[]) {
  let score = 0;

  for (let i = 0; i < indicatorRef.length; i++) {
    if (indicatorRef[i] === indicator[i]) {
      score++;
    }
  }

  return score;
}

function processSequences(sequences: number[][], indicator: number[]) {
  let minSeqLength = Infinity;

  for (let r = 1; r < sequences.length; r++) {
    if (r >= minSeqLength) break;

    const allSequences = combinations(sequences, r);

    for (let i = 0; i < allSequences.length; i++) {
      const newIndicator = [...indicator].map(() => 0);
      const newSequences = allSequences[i];

      if (newSequences.length >= minSeqLength) continue;

      for (let j = 0; j < newSequences.length; j++) {
        const seq = newSequences[j];

        for (let k = 0; k < seq.length; k++) {
          const pos = seq[k];
          newIndicator[pos] = newIndicator[pos] === 1 ? 0 : 1;
        }

        const fidelity = getFidelityScore(indicator, newIndicator);
        const trueLength = j + 1;

        if (fidelity === indicator.length && trueLength < minSeqLength) {
          minSeqLength = trueLength;
        }
      }
    }
  }

  return minSeqLength;
}

const total = commands.reduce(
  (acc, { sequences, indicator }) => acc + processSequences(sequences, indicator),
  0,
);

console.log("Total:", total);
