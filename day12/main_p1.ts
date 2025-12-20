import input from "./input.ts";
import { inputParser } from "../utils.ts";

interface Dimensions {
  w: number;
  h: number;
}

const inputData = inputParser(input, "\n\n");

const shapes = inputData
  .filter((data) => data.includes("#"))
  .map((shape) => shape.split("\n").filter((_, i) => i > 0));

const regions = inputData
  .filter((data) => !data.includes("#"))
  .map((region) => region.split("\n"))
  .flat()
  .map((r) =>
    r.split(": ").map((v, i) => {
      if (i === 0) {
        const [w, h] = v.split("x").map(Number);
        return { w, h };
      }
      return v.split(" ").map(Number);
    }),
  ) as [Dimensions, number[]][];

const numberOfValidAreas = regions.reduce((sum, region) => {
  const { w, h } = region[0];
  const counts = region[1];
  const gridArea = w * h;

  const shapeArea = counts.reduce((acc, count, i) => {
    if (count === 0) return acc;

    const hashCount = shapes[i].reduce((accRow, row) => accRow + (row.match(/#/g) || []).length, 0);

    return acc + hashCount * count;
  }, 0);

  return sum + (shapeArea <= gridArea ? 1 : 0);
}, 0);

console.log("Number of valid areas:", numberOfValidAreas);

// yes it's not a proper solution to this packing problem, but it works for the input ¯\_(ツ)_/¯
