import { useRef, useEffect } from "react";
import "./App.css";

interface Item {
  id: number;
  title: string;
  isBig: boolean;
}

type Cell = number | null
type Direction = "right" | "left";
type SnakeDirection = Direction | "down"

interface Props {
  items: Item[]
}

const MAX_ROWS = 9; // TODO: dynamic
// TODO: this and below as defaultProps?
const MAX_COLS = 4;
const GRID_GAP = 25;
const GRID_CELL_SIDE = 100;

export default function EventsSnakeGrid({ items }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // mutable variables
  let grid: Cell[][] = [[]];
  let row = 0;
  let column = 0;
  let direction: Direction = "right";
  let snake: SnakeDirection[] = [];

  // create grid
  for (let i = 0; i < MAX_ROWS; i++) {
    for (let j = 0; j < MAX_COLS; j++) {
      grid[grid.length - 1].push(null);
    }
    if (i !== MAX_ROWS - 1) grid.push([]);
  }

  function invertDirection(dir: Direction) {
    if (dir === "right") {
      return "left";
    } else {
      return "right";
    }
  }

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
    const step = GRID_CELL_SIDE + GRID_GAP;
    const halfCell = GRID_CELL_SIDE / 2;
    let curPos: [number, number] = [GRID_CELL_SIDE / 2, GRID_CELL_SIDE / 2];

    function clamp(num: number) {
      // TODO: i'm not sure why it's only 1 gap
      return Math.max(Math.min(num, step * 4 - GRID_CELL_SIDE / 2 - GRID_GAP), halfCell);
    }

    ctx.beginPath();
    for (const instruction of snake) {
      if (instruction === "left") {
        ctx.moveTo(...curPos);
        ctx.lineTo(clamp(curPos[0] - step), curPos[1]);
        curPos = [clamp(curPos[0] - step), curPos[1]];
        direction = "left";
      }
      if (instruction === "right") {
        ctx.moveTo(...curPos);
        ctx.lineTo(clamp(curPos[0] + step), curPos[1]);
        curPos = [clamp(curPos[0] + step), curPos[1]];
        direction = "right";
      }
      if (instruction === "down") {
        ctx.moveTo(curPos[0], curPos[1]);
        ctx.lineTo(curPos[0], curPos[1] + step);
        curPos = [curPos[0], curPos[1] + step];
      }
    }
    ctx.stroke();

    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        // TODO: dynamic
        width={500}
        height={1000}
        style={{
          position: "absolute",
          zIndex: -1,
        }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateAreas: areas,
          gridAutoColumns: GRID_CELL_SIDE,
          gridAutoRows: GRID_CELL_SIDE,
          gap: GRID_GAP,
          color: "#2D3648",
        }}
      >
        {items.map((item, i) => {
          return (
            <div
              key={i}
              style={{
                gridArea: `item-${item.id}`,
                backgroundColor: "#D9D9D9",
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
