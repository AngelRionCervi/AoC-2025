import input from "./input.ts";
import { inputParser } from "../utils.ts";

const lines = inputParser(input);

const problems = lines.reduce<(string | number)[][]>((acc, line) => {
  const parts = line
    .split(" ")
    .filter(Boolean)
    .map((part) => (/\d+/.test(part) ? Number(part) : part));

  for (let i = 0; i < parts.length; i++) {
    acc[i] = [...(acc[i] || []), parts[i]];
  }

  return acc;
}, []);

const total = problems.reduce<number>((acc, problem) => {
  const operator = problem[problem.length - 1];

  const problemTotal = (problem.slice(0, -1) as number[]).reduce<number>(
    (subAcc, num) => {
      return operator === "+" ? subAcc + num : subAcc * num;
    },
    operator === "+" ? 0 : 1,
  );

  return acc + problemTotal;
}, 0);

console.log("Total:", total);
