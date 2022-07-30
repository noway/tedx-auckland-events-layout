import { useRef, useEffect } from "react";
import "./App.css";

interface Item {
  id: number;
  title: string;
  isBig: boolean;
}

type Cell = number | null;
type Direction = "right" | "left";
type SnakeDirection = Direction | "down";

interface Props {
  items: Item[];
  lineColor: string;
}

const MAX_ROWS = 9; // TODO: dynamic
// TODO: this and below as defaultProps?
const MAX_COLS = 4;
const GRID_GAP = 25;
const GRID_CELL_SIDE = 100;

function createGrid(rows: number, cols: number) {
  const grid: Cell[][] = [];
  for (let i = 0; i < rows; i++) {
    grid.push([]);
    for (let j = 0; j < cols; j++) {
      grid[grid.length - 1].push(null);
    }
  }
  return grid;
}

function invertDirection(dir: Direction) {
  return dir === "right" ? "left" : "right";
}

export default function EventsSnakeGrid({ items, lineColor }: Props) {
  // derived constants
  const GRID_STEP = GRID_CELL_SIDE + GRID_GAP;
  const GRID_HALF_CELL = GRID_CELL_SIDE / 2;

  // constants
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // mutable variables
  let grid: Cell[][] = createGrid(MAX_ROWS, MAX_COLS);
  let row = 0;
  let column = 0;
  let direction: Direction = "right";
  let snake: SnakeDirection[] = [];

  // TODO: make this a pure function
  function findEmptyCell(): void {
    // calculating next step
    let nextColumn = column;
    let nextRow = row;
    let nextDirection = direction;
    let nextSnake: SnakeDirection[] = [];
    if (nextDirection === "right") {
      nextColumn++;
      nextSnake.push("right");
      if (nextColumn > MAX_COLS - 1) {
        nextRow++;
        nextSnake.push("down");
        nextColumn = MAX_COLS - 1;
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
      return findEmptyCell();
    }
    // don't stop on edges coming from left to right
    if (nextColumn === MAX_COLS - 1 && nextDirection === "right") {
      // committing the step
      column = nextColumn;
      row = nextRow;
      direction = nextDirection;
      snake.push(...nextSnake);
      return findEmptyCell();
    }

    if (grid[nextRow][nextColumn] === null) {
      // committing the step
      column = nextColumn;
      row = nextRow;
      direction = nextDirection;
      snake.push(...nextSnake);
      return;
    } else {
      // going down
      row++;
      snake.push("down");
      if (grid[row][column] === null) {
        return;
      } else {
        // TODO: non-recursive implementation
        findEmptyCell();
      }
    }
  }

  for (const item of items) {
    if (item.isBig) {
      if (direction === "right") {
        if (column + 1 < MAX_COLS) {
          grid[row][column] = item.id;
          grid[row][column + 1] = item.id;
          grid[row + 1][column] = item.id;
          grid[row + 1][column + 1] = item.id;
          column++;
          snake.push("right");
          findEmptyCell();
        } else {
          // findEmptyCell();
          // TODO: path finding
        }
      } else {
        if (column - 1 >= 0) {
          grid[row][column] = item.id;
          grid[row][column - 1] = item.id;
          grid[row + 1][column] = item.id;
          grid[row + 1][column - 1] = item.id;
          column--;
          snake.push("left");
          findEmptyCell();
        } else {
          // findEmptyCell();
          // TODO: path finding
        }
      }
    } else {
      grid[row][column] = item.id;
      findEmptyCell();
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
    let curPos: [number, number] = [GRID_CELL_SIDE / 2, GRID_CELL_SIDE / 2];

    function clamp(num: number) {
      // 1 grid gap here because each step includes a gap, we just need to remove the last gap
      return Math.max(
        Math.min(num, GRID_STEP * MAX_COLS - GRID_CELL_SIDE / 2 - GRID_GAP),
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
        width={GRID_STEP * MAX_COLS - GRID_GAP}
        height={GRID_STEP * MAX_ROWS - GRID_GAP}
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
          gridAutoColumns: GRID_CELL_SIDE,
          gridAutoRows: GRID_CELL_SIDE,
          gap: GRID_GAP,
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
