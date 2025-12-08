import input from "./input.ts";
import { inputParser } from "../utils.ts";

const parsedInput = inputParser(input);

interface Coord {
  x: number;
  y: number;
  z: number;
}

function calculateDistance(a: Coord, b: Coord) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
}

function findClosestCoord(coordinates: Coord[], target: Coord) {
  let minDistance = Infinity;
  let closestCoord: Coord | null = null;

  for (let i = 0; i < coordinates.length; i++) {
    const dist = calculateDistance(coordinates[i], target);

    if (dist < minDistance) {
      minDistance = dist;
      closestCoord = coordinates[i];
    }
  }

  return closestCoord;
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

const circuits: Coord[][] = [...coords].map((coord) => [coord]);
let allDonePairs: boolean[][] = [];

// takes forever, would probably be faster if we stored the distances, not the points
// or maybe precalculate all the distances between every pairs beforehand
do {
  const { closestPair, donePairs } = findClosestPair(coords, allDonePairs);
  if (!closestPair) continue;
  allDonePairs = donePairs;

  const existingCircuits = circuits.filter(
    (circuit) => circuit.indexOf(closestPair[0]) !== -1 || circuit.indexOf(closestPair[1]) !== -1,
  );
  const existingCircuitIndex = circuits.indexOf(existingCircuits[0]);

  // Merge circuits if both points are in different circuits
  if (existingCircuits.length > 1) {
    const circuitAIndex = circuits.indexOf(existingCircuits[0]);
    const circuitBIndex = circuits.indexOf(existingCircuits[1]);

    if (circuitAIndex !== circuitBIndex) {
      circuits[circuitAIndex] = [...circuits[circuitAIndex], ...circuits[circuitBIndex]];
      circuits.splice(circuitBIndex, 1);
    }
    // Add point to existing circuit if only one point is found
  } else if (existingCircuits.length === 1) {
    const connAIndex = existingCircuits[0].indexOf(closestPair[0]);
    const connBIndex = existingCircuits[0].indexOf(closestPair[1]);

    if (connAIndex === -1) {
      circuits[existingCircuitIndex].push(closestPair[0]);
    } else if (connBIndex === -1) {
      circuits[existingCircuitIndex].push(closestPair[1]);
    }
    // Create new circuit if neither point is found
  } else {
    circuits.push([closestPair[0], closestPair[1]]);
  }
} while (circuits.length > 2);

const closestCoord = findClosestCoord(circuits[0], circuits[1][0])!;
const result = closestCoord.x * circuits[1][0].x;

console.log("Result:", result);
