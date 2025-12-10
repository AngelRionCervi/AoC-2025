import input from "./test_input.ts";
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
  const sequences = match[2].split(" ").map((seq) =>
    seq
      .slice(1, -1)
      .split(",")
      .map(Number)
      .sort((a, b) => a - b),
  );

  return { indicator, sequences };
});

function getFidelityScore(indicatorRef: number[], indicator: number[]) {
  let score = 0;

  for (let i = 0; i < indicatorRef.length; i++) {
    if (indicatorRef[i] === indicator[i]) {
      score++;
    }
  }

  return score;
}

function getBestSequence(
  sequences: number[][],
  indicatorRef: number[],
  currIndicator: Command["indicator"],
  startIndex = 0,
  startFidelity = 0,
  startSteps = 0,
  currentSequence: number[][] = [],
) {
  let fidelity = startFidelity;
  let steps = startSteps;

  let newIndicator = [...currIndicator];

  startIndex = startIndex > sequences.length - 1 ? 0 : startIndex;

  for (let i = startIndex; i < sequences.length; i++) {
    const seq = sequences[i];

    for (let k = 0; k < seq.length; k++) {
      const pos = seq[k];
      newIndicator[pos] = currIndicator[pos] === 1 ? 0 : 1;
    }

    const newFidelity = getFidelityScore(indicatorRef, newIndicator);

    if (newFidelity > fidelity) {
      steps++;
      fidelity = newFidelity;
      currentSequence = [...currentSequence, seq];

      if (fidelity === indicatorRef.length) {
        return { steps, fidelity, currentSequence };
      }
    } else {
      newIndicator = newIndicator.map(() => 0);
      fidelity = 0;
      steps = 0;
      currentSequence = [];
    }
    
    return getBestSequence(sequences, indicatorRef, newIndicator, i + 1, fidelity, steps, currentSequence);
  }
}
// const startFidelity = getFidelityScore(
//   [...commands[0].indicator],
//   [...commands[0].indicator].map(() => 0),
// );
// const bestSeq = getBestSequence(0, [...commands[0].indicator], 0, startFidelity);

// console.log("Best sequence for command 0:", bestSeq);

for (let i = 0; i < commands.length; i++) {
  const indicatorRef = [...commands[i].indicator];
  const indicatorReset = [...commands[i].indicator].map(() => 0);

  const startFidelity = getFidelityScore(
    indicatorRef,
    indicatorReset,
  );

  const filteredSequencesForCommand = commands[i].sequences.filter((seq) => {
    let toggledCount = 0;
    for (const pos of seq) {
      if (commands[i].indicator[pos] === 1) {
        toggledCount++;
      }
    }
    return toggledCount > 0;
  });

  console.log('Filtered sequences for command', i, ':', filteredSequencesForCommand);

  const bestSeq = getBestSequence(
    filteredSequencesForCommand,
    indicatorRef,
    indicatorReset,
    0,
    startFidelity,
  );
  console.log("Best sequence for command:", bestSeq);
}
