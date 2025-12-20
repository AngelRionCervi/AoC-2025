import input from "./input.ts";
import { inputParser } from "../utils.ts";

interface ParsedLine {
  device: string;
  outputs: string[];
}

const lines = inputParser(input);

function parseLine(line: string): ParsedLine {
  const [device, outputs] = line.split(": ");

  return { device, outputs: outputs.split(" ") };
}

function findPathsForDevice(outputs: string[], lines: ParsedLine[]): number {
  return outputs.reduce((acc, output) => {
    const deviceLine = lines.find((line) => line.device === output)!;

    const { outputs: nextOutputs } = deviceLine;

    if (nextOutputs.includes("out")) {
      return acc + 1;
    }

    return acc + findPathsForDevice(nextOutputs, lines);
  }, 0);
}

const parsedLines = lines.map(parseLine);
const start = parsedLines.find((line) => line.device === "you")!;

const total = findPathsForDevice(start.outputs, parsedLines);
console.log("Total paths to 'out':", total);
