import { inputParser } from "../utils.ts";
import input from "./input.ts";

const MIN_DIAL = 0;
const MAX_DIAL = 99;
const DIAL_START = 50;

let currentDial = DIAL_START;
let nbrOfZeros = 0;
const parsedInput = inputParser(input);

function parseRotation(line: string) {
  const direction = line[0];
  const distance = parseInt(line.slice(1), 10);

  return { direction, distance };
}

for (const line of parsedInput) {
  const { direction, distance } = parseRotation(line);

  const trueDistance = distance % 100;

  currentDial += trueDistance * (direction === "R" ? 1 : -1);

  if (currentDial > MAX_DIAL) {
    currentDial = currentDial - MAX_DIAL - 1;
  }

  if (currentDial < MIN_DIAL) {
    currentDial = MAX_DIAL - (-currentDial - 1);
  }

  if (currentDial === 0) {
    nbrOfZeros++;
  }
}

console.log("Number of times dialed to 0:", nbrOfZeros);
