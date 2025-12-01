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

let index = 0;

for (const line of parsedInput) {
  index++;
  const { direction, distance } = parseRotation(line);

  const trueDistance = distance % 100;
  const fullTurns = Math.floor(distance / 100);

  nbrOfZeros += fullTurns;

  const isStartingAtZero = currentDial === 0;
  let noZeroThisTurn = true;

  currentDial += trueDistance * (direction === "R" ? 1 : -1);

  if (currentDial > MAX_DIAL) {
    currentDial = currentDial - MAX_DIAL - 1;
    if (!isStartingAtZero) {
      noZeroThisTurn = false;
      nbrOfZeros++;
    }
  }

  if (currentDial < MIN_DIAL) {
    currentDial = MAX_DIAL - (-currentDial - 1);
    if (!isStartingAtZero) {
      noZeroThisTurn = false;
      nbrOfZeros++;
    }
  }

  if (noZeroThisTurn && currentDial === 0) {
    nbrOfZeros++;
  }
}

console.log("Number of times dialed to 0 (even during rotation):", nbrOfZeros);
