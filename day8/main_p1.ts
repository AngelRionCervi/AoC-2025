import input from "./input.ts";
import { inputParser } from "../utils.ts";

const MAX_CONNECTIONS = 1000;

const parsedInput = inputParser(input);

interface Coord {
  x: number;
  y: number;
  z: number;
}

function calculateDistance(a: Coord, b: Coord) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
}

function findClosestPair(coordinates: Coord[], donePairs: boolean[][]) {
  let minDistance = Infinity;
  let closestPair: [Coord, Coord] | null = null;

  let foundIndexA = -1;
  let foundIndexB = -1;

  for (let i = 0; i < coordinates.length; i++) {
    for (let j = i + 1; j < coordinates.length; j++) {
      const dist = calculateDistance(coordinates[i], coordinates[j]);

      if (dist < minDistance && !donePairs[i]?.[j]) {
        minDistance = dist;
        closestPair = [coordinates[i], coordinates[j]];
        foundIndexA = i;
        foundIndexB = j;
      }
    }
  }

  if (!donePairs[foundIndexA]) {
    donePairs[foundIndexA] = [];
  }

  donePairs[foundIndexA][foundIndexB] = true;

  return { closestPair, donePairs };
}

const coords = parsedInput.map((line) => {
  const [x, y, z] = line.split(",").map(Number);
  return { x, y, z };
});

const circuits: Coord[][] = [];
let allDonePairs: boolean[][] = [];

for (let i = 0; i < MAX_CONNECTIONS; i++) {
  const { closestPair, donePairs } = findClosestPair(coords, allDonePairs);
  if (!closestPair) continue;
  allDonePairs = donePairs;

  const existingCircuits = circuits.filter(
    (circuit) => circuit.indexOf(closestPair[0]) !== -1 || circuit.indexOf(closestPair[1]) !== -1,
  );
  const existingCircuitIndex = circuits.indexOf(existingCircuits[0]);

  if (existingCircuits.length > 1) {
    const newCircuit = existingCircuits.flat();
    circuits[existingCircuitIndex] = newCircuit;

    for (let j = 1; j < existingCircuits.length; j++) {
      const indexToRemove = circuits.indexOf(existingCircuits[j]);
      if (indexToRemove !== -1) {
        circuits.splice(indexToRemove, 1);
      }
    }
  } else if (existingCircuits.length === 1) {
    const connA = existingCircuits[0].indexOf(closestPair[0]);
    const connB = existingCircuits[0].indexOf(closestPair[1]);

    if (connA === -1) {
      circuits[existingCircuitIndex].push(closestPair[0]);
    } else if (connB === -1) {
      circuits[existingCircuitIndex].push(closestPair[1]);
    }
  } else {
    circuits.push([closestPair[0], closestPair[1]]);
  }
}

const circuitSizes = circuits.map((circuit) => circuit.length);
const threeLargestSizes = circuitSizes.sort((a, b) => b - a).slice(0, 3);
const productOfThreeLargest = threeLargestSizes.reduce((acc, size) => acc * size, 1);

console.log("Product of the 3 largest circuit sizes:", productOfThreeLargest);
