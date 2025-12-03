import { inputParser } from "../utils.ts";
import input from "./input.ts";

const parsedInput = inputParser(input);

let totalJolts = 0;

for (const line of parsedInput) {
  const splittedPack = line.split("");

  const possibilities = splittedPack.reduce<number[]>((acc, curr, index, arr) => {
    for (let i = index + 1; i < arr.length; i++) {
      acc.push(Number(`${curr}${arr[i]}`));
    }

    return acc;
  }, []);

  totalJolts += Math.max(...possibilities);
}

console.log("Total accumulated jolts (2 digits):", totalJolts);
