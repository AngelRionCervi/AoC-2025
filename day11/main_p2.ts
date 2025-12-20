import input from "./input.ts";
import { inputParser } from "../utils.ts";

interface ParsedLine {
  device: string;
  outputs: string[];
}

const next: Record<string, Set<string>> = {};
const prev: Record<string, Set<string>> = {};

const lines = inputParser(input);
const parsedLines = lines.map((line) => {
  const [device, outputs] = line.split(": ");

  return { device, outputs: outputs.split(" ") };
});

for (const line of parsedLines) {
  const { device, outputs } = line;
  if (!next[device]) {
    next[device] = new Set();
  }

  for (const o of outputs) {
    next[device].add(o);
    if (!prev[o]) {
      prev[o] = new Set();
    }
    prev[o].add(device);
  }
}

function getPathsToOut(
  start: ParsedLine,
  lines: ParsedLine[],
  visited: Set<string> = new Set(),
): string[][] {
  visited.add(start.device);
  const paths: string[][] = [];

  for (const output of start.outputs) {
    if (visited.has(output)) {
      continue;
    }
    const correspondingLine = lines.find((line) => line.device === output);
    if (!correspondingLine) {
      continue;
    }
    const subPaths = getPathsToOut(correspondingLine, lines, visited);
    for (const subPath of subPaths) {
      paths.push([start.device, ...subPath]);
    }
  }

  visited.delete(start.device);

  return paths;
}

function dacOrFftFirst(dac: string, fft: string, lines: ParsedLine[]): ParsedLine {
  const [lineDac, lineFft] = [dac, fft].map(
    (device) => lines.find((line) => line.device === device)!,
  );
  const pathsFromDac = getPathsToOut(lineDac, lines);
  for (const path of pathsFromDac) {
    if (path.includes(lineFft.device)) {
      return lineDac;
    }
  }
  return lineFft;
}

function pathCount(source: string, dest: string, adj: Record<string, Set<string>>): number {
  const stack: string[] = [source];
  let count = 0;

  while (stack.length > 0) {
    const o = stack.pop()!;
    if (o === dest) {
      count++;
      continue;
    }
    for (const u of adj[o] || []) {
      stack.push(u);
    }
  }

  return count;
}

function reachableFrom(start: string, adj: Record<string, Set<string>>): Set<string> {
  const visited = new Set<string>();

  function dfs(o: string) {
    if (visited.has(o)) {
      return;
    }
    visited.add(o);
    for (const u of adj[o] || []) {
      dfs(u);
    }
  }

  dfs(start);

  return visited;
}

function pathCountPruned(start: string, dest: string): number {
  const mid = new Set(
    [...reachableFrom(start, next)].filter((x) => reachableFrom(dest, prev).has(x)),
  );

  const pruned: Record<string, Set<string>> = {};

  for (const u in next) {
    if (!mid.has(u)) {
      continue;
    }
    pruned[u] = new Set([...next[u]].filter((v) => mid.has(v)));
  }

  return pathCount(start, dest, pruned);
}

const firstMid = dacOrFftFirst("dac", "fft", parsedLines);

let m1 = "dac";
let m2 = "fft";

if (firstMid.device === "fft") {
  m1 = "fft";
  m2 = "dac";
}

const result = pathCountPruned("svr", m1) * pathCountPruned(m1, m2) * pathCountPruned(m2, "out");

console.log(`Total paths from 'svr' to 'out' with 'fft' and 'dac':`, result);

// solution adapated from: https://old.reddit.com/r/adventofcode/comments/1pjp1rm/comment/ntz8za1/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
