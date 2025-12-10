import input from "./input.ts";
import { inputParser } from "../utils.ts";

const parsedInput = inputParser(input);

type Coord = number[];

function calculateDistance(a: Coord, b: Coord) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function calcDimension(a: Coord, b: Coord) {
  const width = Math.abs(a[0] - b[0]);
  const height = Math.abs(a[1] - b[1]);

  return (width + 1) * (height + 1);
}

let largestDistance = 0;
let largestSurface = 0;

const coords = parsedInput.map((line) => line.split(",").map(Number));

for (let i = 0; i < coords.length - 1; i++) {
  const coordA: Coord = coords[i];

  for (let j = i + 1; j < coords.length; j++) {
    const coordB: Coord = coords[j];

    const dist = calculateDistance(coordA, coordB);
    if (dist > largestDistance) {
      largestDistance = dist;
      largestSurface = calcDimension(coordA, coordB);
    }
  }
}

console.log("Largest surface:", largestSurface);
