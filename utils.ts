export function inputParser(input: string, separator = "\n") {
  return input.trim().split(separator);
}

export function sum(numbers: number[]) {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}
