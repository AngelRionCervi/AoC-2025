import input from "./input.ts";
import { inputParser } from "../utils.ts";

const parsedInput = inputParser(input);

type Coord = number[];

interface Rectangle {
  topLeft: Coord;
  topRight: Coord;
  bottomLeft: Coord;
  bottomRight: Coord;
}

const coords = parsedInput.map((line) => line.split(",").map(Number));

function calculateDistance(a: Coord, b: Coord) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function calcDimension(a: Coord, b: Coord) {
  const width = Math.abs(a[0] - b[0]);
  const height = Math.abs(a[1] - b[1]);

  return (width + 1) * (height + 1);
}

function getRect(cornerA: Coord, cornerB: Coord): Rectangle {
  const topRight: Coord = [Math.max(cornerA[0], cornerB[0]), Math.min(cornerA[1], cornerB[1])];
  const bottomLeft: Coord = [Math.min(cornerA[0], cornerB[0]), Math.max(cornerA[1], cornerB[1])];
  const topLeft: Coord = [bottomLeft[0], topRight[1]];
  const bottomRight: Coord = [topRight[0], bottomLeft[1]];

  return { topLeft, topRight, bottomLeft, bottomRight };
}

function checkCollisionWithOtherCoords(cornerA: Coord, cornerB: Coord) {
  const rectA = getRect(cornerA, cornerB);

  for (let i = 0; i < coords.length; i++) {
    const nextI = i + 1 >= coords.length ? 0 : i + 1;
    const rectB = getRect(coords[i], coords[nextI]);

    if (
      rectA.topLeft[0] < rectB.topRight[0] &&
      rectA.topRight[0] > rectB.topLeft[0] &&
      rectA.topLeft[1] < rectB.bottomLeft[1] &&
      rectA.bottomLeft[1] > rectB.topLeft[1]
    ) {
      return true;
    }
  }

  return false;
}

let largestDistance = 0;
let largestSurface = 0;

for (let i = 0; i < coords.length - 1; i++) {
  const cornerA: Coord = coords[i];

  for (let j = i + 1; j < coords.length; j++) {
    const cornerB: Coord = coords[j];

    const isIntersecting = checkCollisionWithOtherCoords(cornerA, cornerB);

    if (isIntersecting) continue;

    const dist = calculateDistance(cornerA, cornerB);
    if (dist > largestDistance) {
      largestDistance = dist;
      largestSurface = calcDimension(cornerA, cornerB);
    }
  }
}

console.log("Largest surface contained in green area:", largestSurface);
