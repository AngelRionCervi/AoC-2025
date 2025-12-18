import input from "./input.ts";
import { inputParser } from "../utils.ts";

interface Command {
  joltages: number[];
  sequences: number[][];
}

const inputLines = inputParser(input);

const commands = inputLines.map<Command>((line) => {
  const match = line.match(/^\[(.+)\] (.+) \{(.+)\}$/);
  if (!match) throw new Error("Invalid input line: " + line);

  const sequences = match[2].split(" ").map((seq) => seq.slice(1, -1).split(",").map(Number));
  const joltages = match[3].split(",").map(Number);

  return { sequences, joltages };
});

function combinations(n: number, k: number): number[][] {
  const result: number[][] = [];
  const combo: number[] = [];

  function backtrack(start: number) {
    if (combo.length === k) {
      result.push([...combo]);
      return;
    }
    for (let i = start; i < n; i++) {
      combo.push(i);
      backtrack(i + 1);
      combo.pop();
    }
  }
  backtrack(0);

  return result;
}

function tupleKey(t: number[]): string {
  return t.join(",");
}

function getPatternCosts(coeffs: number[][]): Map<string, number> {
  const patternMap = new Map<string, number>();
  const numButtons = coeffs.length;
  const numVariables = coeffs[0].length;

  for (let patternLen = 0; patternLen <= numButtons; patternLen++) {
    const allButtons = combinations(numButtons, patternLen);

    for (const buttons of allButtons) {
      const pattern = new Array<number>(numVariables).fill(0);

      for (const b of buttons) {
        for (let i = 0; i < numVariables; i++) {
          pattern[i] += coeffs[b][i];
        }
      }

      const key = tupleKey(pattern);
      if (!patternMap.has(key)) {
        patternMap.set(key, patternLen);
      }
    }
  }

  return patternMap;
}

function findShortestSolution(
  joltages: number[],
  memo: Map<string, number>,
  patternCosts: Map<string, number>,
): number {
  const key = tupleKey(joltages);
  if (memo.has(key)) {
    return memo.get(key)!;
  }

  if (joltages.every((v) => v === 0)) {
    return 0;
  }

  let presses = Infinity;

  for (const [patternKey, patternCost] of patternCosts.entries()) {
    const pattern = patternKey.split(",").map(Number);
    const isPatternOk = pattern.every((p, i) => p <= joltages[i] && p % 2 === joltages[i] % 2);

    if (!isPatternOk) continue;

    const newJoltages = pattern.map((p, i) => (joltages[i] - p) / 2);
    const pressesCondidate =
      patternCost + 2 * findShortestSolution(newJoltages, memo, patternCosts);

    if (pressesCondidate < presses) {
      presses = pressesCondidate;
    }
  }

  memo.set(key, presses);

  return presses;
}

const fewestPressesTotal = commands.reduce((acc, { sequences, joltages }) => {
  const coeffs = sequences.map((r) => joltages.map((_, i) => (r.includes(i) ? 1 : 0)));
  const patternCosts = getPatternCosts(coeffs);
  const memo = new Map<string, number>();

  return acc + findShortestSolution(joltages, memo, patternCosts);
}, 0);

console.log("Fewest button presses to configure joltages:", fewestPressesTotal);

// solution adapted from: https://old.reddit.com/r/adventofcode/comments/1pk87hl/2025_day_10_part_2_bifurcate_your_way_to_victory/
