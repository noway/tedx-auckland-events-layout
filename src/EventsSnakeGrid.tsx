import { useRef, useEffect } from "react";
import "./App.css";
import {
  clearCanvasSnake,
  drawCanvasSnake,
  getAreas,
  generateGridRecursive,
  generateGridSimple,
  Item,
} from "./snakeGrid";

interface Props {
  items: Item[];
  lineColor: string;
  cellSize?: number;
  columns?: number;
  gap?: number;
  algo?: "recursive" | "simple";
}

export default function EventsSnakeGrid({
  items,
  lineColor,
  cellSize = 100,
  columns = 4,
  gap = 25,
  algo = "recursive",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const func =
    algo === "recursive" ? generateGridRecursive : generateGridSimple;
  const { history, grid } = func(columns, items);
  const areas = getAreas(grid)
  useEffect(() => {
    const canvas = canvasRef.current!;
    drawCanvasSnake({ canvas, cellSize, columns, gap, lineColor, history });
    return () => {
      clearCanvasSnake({ canvas });
    };
  }, [lineColor, history, columns, cellSize, gap]);
  return (
    <>
      <canvas
        ref={canvasRef}
        // just like above, subtract 1 grid gap because each step includes a gap,
        // we just need to remove the last gap
        width={cellSize * columns + gap * (columns - 1)}
        height={cellSize * areas.length + gap * (areas.length - 1)}
        style={{
          position: "absolute",
          zIndex: -1,
        }}
      />
      <div
        className="events__grid"
        style={{
          display: "grid",
          gridTemplateAreas: areas.join(" "),
          gridAutoColumns: cellSize,
          gridAutoRows: cellSize,
          gap: gap,
        }}
      >
        {items.map((item, i) => {
          return (
            <div
              key={i}
              className={[
                "events__item",
                ...(item.isBig ? ["events__item--big"] : []),
              ].join(" ")}
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
