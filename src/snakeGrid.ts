import { random } from "./prng";

const CIRCUIT_BREAKER_ITERATIONS = 3;

export interface Item {
  id: number;
  title: string;
  isBig: boolean;
}

interface SnakeProgress {
  column: number;
  row: number;
  direction: Direction;
  history: SnakeDirection[];
}

type Cell = number | null;
type Direction = "right" | "left";
type SnakeDirection = Direction | "down";
export type Grid = Cell[][];

export function generateItems(seed: number, count: number) {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push({ id: i, title: i.toString(), isBig: random(i, seed) > 0.7 });
  }
  return items;
}

export function isAreasValid(areas: string[]) {
  const el = document.createElement("div");
  el.style.gridTemplateAreas = areas.join(" ");
  const valid = el.style.length == 1;
  el.remove();
  return valid;
}

function invertDirection(dir: Direction) {
  return dir === "right" ? "left" : "right";
}

function strip(grid: Grid) {
  const lastRow = grid[grid.length - 1];
  if (lastRow.every((cell) => cell === null)) {
    return grid.slice(0, -1);
  }
  return grid;
}

function findEmptyCell(
  grid: Grid,
  snakeProgress: SnakeProgress
): SnakeProgress {
  const columns = grid[0].length;
  let { column, row, direction, history } = snakeProgress;

  let iterations = 0;
  // calculating next step
  do {
    iterations++;
    if (iterations > CIRCUIT_BREAKER_ITERATIONS) {
      throw new Error("Could not find empty cell");
    }

    let nextColumn = column;
    let nextRow = row;
    let nextDirection = direction;
    let nextSnake: SnakeDirection[] = [];

    function commitStep() {
      column = nextColumn;
      if (nextRow > row) grid.push(Array(columns).fill(null));
      row = nextRow;
      direction = nextDirection;
      history.push(...nextSnake);
    }

    // snake goes forward
    if (nextDirection === "right") {
      nextColumn++;
      nextSnake.push("right");
      if (nextColumn > columns - 1) {
        nextRow++;
        nextSnake.push("down");
        nextColumn = columns - 1;
        nextDirection = invertDirection(nextDirection);
      }
    } else {
      nextColumn--;
      nextSnake.push("left");
      if (nextColumn < 0) {
        nextRow++;
        nextSnake.push("down");
        nextColumn = 0;
        nextDirection = invertDirection(nextDirection);
      }
    }

    // don't stop on edges coming from right to left
    if (nextColumn === 0 && nextDirection === "left") {
      commitStep();
      continue;
    }

    // don't stop on edges coming from left to right
    if (nextColumn === columns - 1 && nextDirection === "right") {
      commitStep();
      continue;
    }

    // if there's a barrier, go down instead and keep looking
    if (grid[nextRow][nextColumn] !== null) {
      // going down
      nextColumn = column;
      nextRow = row + 1;
      nextSnake = ["down"];

      commitStep();
      if (grid[row][column] !== null) {
        continue;
      } else {
        break; // found empty cell - stop
      }
    }

    commitStep();
    break; // found empty cell - stop
  } while (true);

  return {
    column,
    row,
    direction,
    history,
  };
}

function fillBigItem(
  grid: Grid,
  snakeProgress: SnakeProgress,
  item: Item
): SnakeProgress {
  function directionSign() {
    return snakeProgress.direction === "right" ? 1 : -1;
  }

  // if the adjacent cell is not empty, keep looking
  let iterations = 0;
  while (
    grid[snakeProgress.row][snakeProgress.column + directionSign()] !== null
  ) {
    iterations++;
    if (iterations > CIRCUIT_BREAKER_ITERATIONS) {
      throw new Error("Could not find empty cell");
    }

    snakeProgress = findEmptyCell(grid, snakeProgress);
  }

  // fill the 4 cells
  grid[snakeProgress.row][snakeProgress.column] = item.id;
  grid[snakeProgress.row][snakeProgress.column + directionSign()] = item.id;
  grid[snakeProgress.row + 1][snakeProgress.column] = item.id;
  grid[snakeProgress.row + 1][snakeProgress.column + directionSign()] = item.id;

  return {
    ...snakeProgress,
    column: snakeProgress.column + directionSign(),
    history: [...snakeProgress.history, snakeProgress.direction],
  };
}

export function generateGridRecursive(columns: number, items: Item[]) {
  let grid: Grid = [...Array(2).keys()].map(() => Array(columns).fill(null));
  let snakeProgress: SnakeProgress = {
    row: 0,
    column: 0,
    direction: "right",
    history: [],
  };

  for (const item of items) {
    if (item.isBig) {
      if (snakeProgress.direction === "right") {
        if (snakeProgress.column + 1 < columns) {
          snakeProgress = fillBigItem(grid, snakeProgress, item);
          snakeProgress = findEmptyCell(grid, snakeProgress);
        } else {
          console.error(
            "This code path should not be hit - we avoid stopping on edges (right-to-left case)"
          );
        }
      } else {
        if (snakeProgress.column - 1 >= 0) {
          snakeProgress = fillBigItem(grid, snakeProgress, item);
          snakeProgress = findEmptyCell(grid, snakeProgress);
        } else {
          console.error(
            "This code path should not be hit - we avoid stopping on edges (left-to-right case)"
          );
        }
      }
    } else {
      grid[snakeProgress.row][snakeProgress.column] = item.id;
      snakeProgress = findEmptyCell(grid, snakeProgress);
    }
  }

  return { history: snakeProgress.history, grid };
}

export function generateGridSimple(columns: number, items: Item[]) {
  let grid: Grid = [...Array(2).keys()].map(() => Array(columns).fill(null));
  let row = 0;
  let column = 0;
  let direction: Direction = "right";
  let history: SnakeDirection[] = [];

  function downAndInvert(column: number) {
    grid.push(Array(columns).fill(null));
    grid.push(Array(columns).fill(null));
    row += 2;
    column = column;
    direction = invertDirection(direction);
    history.push("down", "down");
  }

  function goForward() {
    column += direction === "right" ? 1 : -1;
    history.push(direction);
    if (direction === "right") {
      if (column > columns - 2) {
        downAndInvert(columns - 1);
      }
    } else {
      if (column < 1) {
        downAndInvert(0);
      }
    }
  }

  function directionSign() {
    return direction === "right" ? 1 : -1;
  }

  for (const item of items) {
    if (item.isBig) {
      if (direction === "right") {
        if (column + 1 <= columns - 1) {
          // will be enough space to fill the big item
        } else {
          downAndInvert(columns - 1);
        }
      } else {
        if (column - 1 >= 0) {
          // will be enough space to fill the big item
        } else {
          downAndInvert(0);
        }
      }

      grid[row][column] = item.id;
      grid[row][column + directionSign()] = item.id;
      grid[row + 1][column] = item.id;
      grid[row + 1][column + directionSign()] = item.id;
      goForward();
      goForward();
    } else {
      grid[row][column] = item.id;
      goForward();
    }
  }

  return { history, grid };
}

export function generateGridHybrid(columns: number, items: Item[]) {
  try {
    return generateGridRecursive(columns, items);
  }
  catch (e) {
    return generateGridSimple(columns, items);
  }
}

export function getAreas(grid: Grid) {
  return strip(grid).map((gridLine) => {
    const line = gridLine
      .map((cell) => {
        if (cell === null) {
          return ".";
        }
        return `item-${cell}`;
      })
      .join(" ");
    return `'${line}'`;
  });
}

export function clearCanvasSnake({ canvas }: { canvas: HTMLCanvasElement }) {
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function drawCanvasSnake({
  canvas,
  cellSize,
  columns,
  gap,
  lineColor,
  history,
}: {
  canvas: HTMLCanvasElement;
  cellSize: number;
  columns: number;
  gap: number;
  lineColor: string;
  history: SnakeDirection[];
}) {
  const ctx = canvas.getContext("2d")!;
  const GRID_STEP = cellSize + gap;
  const GRID_HALF_CELL = cellSize / 2;
  let curPos: [number, number] = [cellSize / 2, cellSize / 2];

  function clamp(num: number) {
    // 1 grid gap here because each step includes a gap, we just need to remove the last gap
    return Math.max(
      Math.min(num, GRID_STEP * columns - cellSize / 2 - gap),
      GRID_HALF_CELL
    );
  }

  ctx.beginPath();
  ctx.strokeStyle = lineColor;
  for (const instruction of history) {
    if (instruction === "left") {
      ctx.moveTo(...curPos);
      ctx.lineTo(clamp(curPos[0] - GRID_STEP), curPos[1]);
      curPos = [clamp(curPos[0] - GRID_STEP), curPos[1]];
    }
    if (instruction === "right") {
      ctx.moveTo(...curPos);
      ctx.lineTo(clamp(curPos[0] + GRID_STEP), curPos[1]);
      curPos = [clamp(curPos[0] + GRID_STEP), curPos[1]];
    }
    if (instruction === "down") {
      ctx.moveTo(curPos[0], curPos[1]);
      ctx.lineTo(curPos[0], curPos[1] + GRID_STEP);
      curPos = [curPos[0], curPos[1] + GRID_STEP];
    }
  }
  ctx.stroke();
}
