import { useState } from "react";
import EventsSnakeGrid from "./EventsSnakeGrid";
import { generateItems } from "./snakeGrid";
import { useColorScheme } from "./useColorScheme";

const defaultItems = [
  { id: 1, title: "1", isBig: true },
  { id: 2, title: "2", isBig: false },
  { id: 3, title: "3", isBig: false },
  { id: 4, title: "4", isBig: false },
  { id: 5, title: "5", isBig: false },
  { id: 6, title: "6", isBig: true },
  { id: 7, title: "7", isBig: false },
  { id: 8, title: "8", isBig: false },
  { id: 9, title: "9", isBig: false },
  { id: 10, title: "10", isBig: false },
  { id: 11, title: "11", isBig: false },
  { id: 12, title: "12", isBig: false },
  { id: 13, title: "13", isBig: true },
  { id: 14, title: "14", isBig: false },
  { id: 15, title: "15", isBig: false },
];

export default function Demo() {
  const colorScheme = useColorScheme();
  const [cellSize, setCellSize] = useState(100);
  const [columns, setColumns] = useState(4);
  const [gap, setGap] = useState(25);
  const [count, setCount] = useState(16);
  const [seed, setSeed] = useState<number | null>(null);
  const items = seed ? generateItems(seed, count) : defaultItems;
  const [recursiveAlgo, setRecursiveAlgo] = useState(true);

  return (
    <div>
      <button onClick={() => setSeed(Math.random() * 256)}>Random</button>
      <input
        type="range"
        min={20}
        max={300}
        value={cellSize}
        onChange={(e) => setCellSize(Number(e.target.value))}
      />
      <input
        type="range"
        min={2}
        max={10}
        value={columns}
        onChange={(e) => setColumns(Number(e.target.value))}
      />
      <input
        type="range"
        min={0}
        max={50}
        value={gap}
        onChange={(e) => setGap(Number(e.target.value))}
      />
      <input
        type="range"
        min={4}
        max={128}
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        disabled={seed === null}
      />
      <input
        type="checkbox"
        checked={recursiveAlgo}
        onChange={(e) => setRecursiveAlgo(e.target.checked)}
      />
      <br />
      <br />
      <EventsSnakeGrid
        items={items}
        lineColor={colorScheme === "dark" ? "#D9D9D9" : "#2D3648"}
        cellSize={cellSize}
        columns={columns}
        gap={gap}
        algo={recursiveAlgo ? "recursive" : "simple"}
      />
    </div>
  );
}
