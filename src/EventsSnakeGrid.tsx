import { useRef, useEffect } from "react";
import "./App.css";

interface Item {
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

interface Props {
  items: Item[];
  lineColor: string;
  cellSize?: number;
  columns?: number;
  gap?: number;
}

const MAX_ROWS = 9; // TODO: dynamic

function createGrid(rows: number, cols: number) {
  const grid: Cell[][] = [];
  for (let i = 0; i < rows; i++) {
    grid.push([]);
    for (let j = 0; j < cols; j++) {
      grid[i].push(null);
    }
  }
  return grid;
}

function invertDirection(dir: Direction) {
  return dir === "right" ? "left" : "right";
}

function findEmptyCell(grid: Cell[][], columns: number, snakeProgress: SnakeProgress): SnakeProgress {
  let { column, row, direction, history: snake } = snakeProgress;
  do {
    // calculating next step
    let nextColumn = column;
    let nextRow = row;
    let nextDirection = direction;
    let nextSnake: SnakeDirection[] = [];

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
      // committing the step
      column = nextColumn;
      row = nextRow;
      direction = nextDirection;
      snake.push(...nextSnake);
      continue;
    }

    // don't stop on edges coming from left to right
    if (nextColumn === columns - 1 && nextDirection === "right") {
      // committing the step
      column = nextColumn;
      row = nextRow;
      direction = nextDirection;
      snake.push(...nextSnake);
      continue;
    }

    // if there's a barrier, go down and keep looking
    if (grid[nextRow][nextColumn] !== null) {
      // going down
      row++;
      snake.push("down");
      if (grid[row][column] !== null) {
        continue;
      } else {
        break;
      }
    }

    // committing the step
    column = nextColumn;
    row = nextRow;
    direction = nextDirection;
    snake.push(...nextSnake);
    break;
  } while (true);

  return {
    column,
    row,
    direction,
    history: snake,
  };
}

export default function EventsSnakeGrid({
  items,
  lineColor,
  cellSize = 100,
  columns = 4,
  gap = 25,
}: Props) {
  // derived constants
  const GRID_STEP = cellSize + gap;
  const GRID_HALF_CELL = cellSize / 2;

  // constants
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // mutable variables
  let grid: Cell[][] = createGrid(MAX_ROWS, columns);
  let row = 0;
  let column = 0;
  let direction: Direction = "right";
  let snake: SnakeDirection[] = [];

  for (const item of items) {
    if (item.isBig) {
      if (direction === "right") {
        if (column + 1 < columns) {
          grid[row][column] = item.id;
          grid[row][column + 1] = item.id;
          grid[row + 1][column] = item.id;
          grid[row + 1][column + 1] = item.id;
          column++;
          snake.push("right");
          ({
            column,
            row,
            direction,
            history: snake,
          } = findEmptyCell(grid, columns, { column, row, direction, history: snake }));
        } else {
          // TODO: path finding (findEmptyCell()?)
        }
      } else {
        if (column - 1 >= 0) {
          grid[row][column] = item.id;
          grid[row][column - 1] = item.id;
          grid[row + 1][column] = item.id;
          grid[row + 1][column - 1] = item.id;
          column--;
          snake.push("left");
          ({
            column,
            row,
            direction,
            history: snake,
          } = findEmptyCell(grid, columns, { column, row, direction, history: snake }));
        } else {
          // TODO: path finding (findEmptyCell()?)
        }
      }
    } else {
      grid[row][column] = item.id;
      ({
        column,
        row,
        direction,
        history: snake,
      } = findEmptyCell(grid, columns, { column, row, direction, history: snake }));
    }
  }

  const areas = grid
    .map((gridLine) => {
      const line = gridLine
        .map((cell) => {
          if (cell === null) {
            return ".";
          }
          return `item-${cell}`;
        })
        .join(" ");
      return `'${line}'`;
    })
    .join(" ");

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
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
    for (const instruction of snake) {
      if (instruction === "left") {
        ctx.moveTo(...curPos);
        ctx.lineTo(clamp(curPos[0] - GRID_STEP), curPos[1]);
        curPos = [clamp(curPos[0] - GRID_STEP), curPos[1]];
        direction = "left";
      }
      if (instruction === "right") {
        ctx.moveTo(...curPos);
        ctx.lineTo(clamp(curPos[0] + GRID_STEP), curPos[1]);
        curPos = [clamp(curPos[0] + GRID_STEP), curPos[1]];
        direction = "right";
      }
      if (instruction === "down") {
        ctx.moveTo(curPos[0], curPos[1]);
        ctx.lineTo(curPos[0], curPos[1] + GRID_STEP);
        curPos = [curPos[0], curPos[1] + GRID_STEP];
      }
    }
    ctx.stroke();

    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [lineColor, snake]);

  return (
    <>
      <canvas
        ref={canvasRef}
        // just like above, subtract 1 grid gap because each step includes a gap,
        // we just need to remove the last gap
        width={GRID_STEP * columns - gap}
        height={GRID_STEP * MAX_ROWS - gap}
        style={{
          position: "absolute",
          zIndex: -1,
        }}
      />
      <div
        className="events__grid"
        style={{
          display: "grid",
          gridTemplateAreas: areas,
          gridAutoColumns: cellSize,
          gridAutoRows: cellSize,
          gap: gap,
        }}
      >
        {items.map((item, i) => {
          return (
            <div
              className={[
                "events__item",
                ...(item.isBig ? ["events__item--big"] : []),
              ].join(" ")}
              key={i}
              style={{
                gridArea: `item-${item.id}`,
              }}
            >
              {item.title}
            </div>
          );
        })}
      </div>
    </>
  );
}
