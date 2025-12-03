export function inputParser(input: string, separator = "\n"): string[] {
  return input.trim().split(separator);
}
