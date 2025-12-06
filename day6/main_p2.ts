import input from "./input.ts";
import { inputParser } from "../utils.ts";

function splitStringAtIndexes(str: string, indexes: number[]) {
  const result: string[] = [];
  let start = 0;

  for (const i of indexes) {
    result.push(str.slice(start, i));
    start = i;
  }

  result.push(str.slice(start));

  return result;
}

function getIndexesToSplitAt(lines: string[]) {
  const linesSpaceIndexes = lines.reduce<number[][]>((acc, line, idx) => {
    for (let i = 0; i < line.length; i++) {
      if (line[i] === " ") {
        acc[idx] = [...acc[idx] || [], i];
      }
    }
    return acc;
  }, []);

  return linesSpaceIndexes.reduce<number[]>((acc, indexes) => {
    if (acc.length === 0) return indexes;
    return acc.filter((index) => indexes.includes(index));
  }, []);
}

function getRearrangedOperands(operands: string[]) {
  const reArrangedOperands: number[] = [];

  for (let i = operands[0].length - 1; i >= 0; i--) {
    let nToProcess = "";
    for (let j = 0; j < operands.length; j++) {
      nToProcess += operands[j][i] || "";
    }
    const nToProcessNumber = Number(nToProcess);
    if (nToProcessNumber) {
      reArrangedOperands.push(nToProcessNumber);
    }
  }

  return reArrangedOperands;
}

const lines = inputParser(input);

const problems = lines.reduce<string[][]>((acc, line, idx) => {
  let parts = splitStringAtIndexes(line, getIndexesToSplitAt(lines));

  if (idx === lines.length - 1) {
    parts = parts.map((part) => part.trim());
  }

  for (let i = 0; i < parts.length; i++) {
    acc[i] = [...(acc[i] || []), parts[i]];
  }

  return acc;
}, []);

const total = problems.reduce<number>((acc, problem) => {
  const operator = problem[problem.length - 1];
  const operands = problem.slice(0, -1);
  // It should be faster to just do the arithmetic directly rather than rearranging the operands
  const reArrangedOperands = getRearrangedOperands(operands);

  return (
    acc +
    reArrangedOperands.reduce<number>(
      (subAcc, num) => {
        return operator === "+" ? subAcc + num : subAcc * num;
      },
      operator === "+" ? 0 : 1,
    )
  );
}, 0);

console.log("Total in 🐙 math:", total);
