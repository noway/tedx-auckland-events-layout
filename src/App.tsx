import { useRef, useEffect } from "react";
import './App.css'

const items = [
  { t: "01", big: true },
  { t: "02", big: false },
  { t: "03", big: false },
  { t: "04", big: false },
  { t: "05", big: false },
  { t: "06", big: true },
  { t: "07", big: false },
  { t: "08", big: false },
  { t: "09", big: false },
  { t: "10", big: false },
  { t: "11", big: false },
  { t: "12", big: false },
  { t: "13", big: true },
  { t: "14", big: false },
  { t: "15", big: false }
];

const MAX_ROWS = 9; // TODO: dynamic
const MAX_COLS = 4;

// create grid
let grid: string[][] = [[]];
for (var i = 0; i < MAX_ROWS; i++) {
  for (var j = 0; j < MAX_COLS; j++) {
    grid[grid.length - 1].push("00");
  }
  if (i !== MAX_ROWS - 1) grid.push([]);
}

let row = 0;
let column = 0;
type Direction = "right" | "left"
let direction: Direction = "right";
function invertDirection(dir: Direction) {
  if (dir === "right") {
    return "left";
  } else {
    return "right";
  }
}

let snake: string[] = [];

function findEmptyCell(): void {
  // calculating next step
  let nextColumn = column;
  let nextRow = row;
  let nextDirection = direction;
  let nextSnake = [];
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

  if (grid[nextRow][nextColumn] === "00") {
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
    if (grid[row][column] === "00") {
      return;
    } else {
      // TODO: non-recursive implementation
      findEmptyCell();
    }
  }
}

for (let i = 0; i < items.length; i++) {
  const item = items[i];
  if (item.big) {
    if (direction === "right") {
      if (column + 1 < MAX_COLS) {
        grid[row][column] = item.t;
        grid[row][column + 1] = item.t;
        grid[row + 1][column] = item.t;
        grid[row + 1][column + 1] = item.t;
        column++;
        snake.push("right");
        findEmptyCell();
      } else {
        // findEmptyCell();
        // TODO: path finding
      }
    } else {
      if (column - 1 >= 0) {
        grid[row][column] = item.t;
        grid[row][column - 1] = item.t;
        grid[row + 1][column] = item.t;
        grid[row + 1][column - 1] = item.t;
        column--;
        snake.push("left");
        findEmptyCell();
      } else {
        // findEmptyCell();
        // TODO: path finding
      }
    }
  } else {
    grid[row][column] = item.t;
    findEmptyCell();
  }
}

export default function App() {
  const areas = grid
    .map((gridLine) => {
      const line = gridLine
        .map((cell) => {
          if (cell === "00") {
            return ".";
          }
          return `cell${cell}`;
        })
        .join(" ");
      return `'${line}'`;
    })
    .join(" ");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gap = 25;
  const cell = 100;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const step = cell + gap;
    const halfStep = step / 2;
    let curPos: [number, number] = [cell / 2, cell / 2];

    function clamp(num: number) {
      // TODO: i'm not sure why it's only 1 gap
      return Math.max(Math.min(num, step * 4 - cell / 2 - gap), halfStep);
    }
    ctx.beginPath();
    for (var i = 0; i < snake.length; i++) {
      const instruction = snake[i];
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
          gridAutoRows: cell,
          gridAutoColumns: cell,
          display: "grid",
          gridTemplateAreas: areas,
          color: "#2D3648",
          gap: gap
        }}
      >
        {items.map((item, i) => {
          return (
            <div
              key={i}
              style={{
                gridArea: `cell${item.t}`,
                backgroundColor: "#D9D9D9"
              }}
            >
              {item.t}
            </div>
          );
        })}
      </div>
    </>
  );
}
