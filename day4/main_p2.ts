import input from "./input.ts";
import { inputParser } from "../utils.ts";

interface Coord {
  x: number;
  y: number;
}

const rows = inputParser(input);

function checkPaperCell(cellCoord: Coord, rowTop: Coord | null, rowBottom: Coord | null) {
  const checks = {
    top: rowTop ? rows[rowTop.y][rowTop.x] === "@" : false,
    right: rows[cellCoord.y][cellCoord.x + 1] === "@",
    bottom: rowBottom ? rows[rowBottom.y][rowBottom.x] === "@" : false,
    left: rows[cellCoord.y][cellCoord.x - 1] === "@",
    topRight: rowTop ? rows[rowTop.y][cellCoord.x + 1] === "@" : false,
    bottomRight: rowBottom ? rows[rowBottom.y][cellCoord.x + 1] === "@" : false,
    bottomLeft: rowBottom ? rows[rowBottom.y][cellCoord.x - 1] === "@" : false,
    topLeft: rowTop ? rows[rowTop.y][cellCoord.x - 1] === "@" : false,
  };

  return Object.values(checks).filter(Boolean).length < 4;
}

let movableCells = 0;
let movedThisIteration = true;

while (movedThisIteration) {
  movedThisIteration = false;

  for (let y = 0; y < rows.length; y++) {
    const cells = rows[y].split("");

    for (let x = 0; x < cells.length; x++) {
      if (cells[x] === ".") continue;

      const coordTop = y > 0 ? { x, y: y - 1 } : null;
      const coordBottom = y < rows.length - 1 ? { x, y: y + 1 } : null;
      const canBeMoved = checkPaperCell({ x, y }, coordTop, coordBottom);

      if (canBeMoved) {
        rows[y] = rows[y].substring(0, x) + "." + rows[y].substring(x + 1);
        movableCells++;
        movedThisIteration = true;
      }
    }
  }
}

console.log("Movable paper rolls:", movableCells);
