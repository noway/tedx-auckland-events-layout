import { useState } from "react";
import EventsSnakeGrid from "./EventsSnakeGrid";
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

function generateItems() {
  const items = [];
  for (let i = 0; i < 16; i++) {
    items.push({ id: i, title: i.toString(), isBig: Math.random() > 0.7 });
  }
  return items;
}

export default function App() {
  const [items, setItems] = useState(defaultItems);
  const colorScheme = useColorScheme();
  const [cellSize, setCellSize] = useState(100);
  const [columns, setColumns] = useState(4);
  const [gap, setGap] = useState(25);

  return (
    <div>
      <button onClick={() => setItems(generateItems())}>Random</button>
      <input type="range" min={20} max={300} value={cellSize} onChange={(e) => setCellSize(Number(e.target.value))}/>
      <input type="range" min={2} max={10} value={columns} onChange={(e) => setColumns(Number(e.target.value))}/>
      <input type="range" min={0} max={50} value={gap} onChange={(e) => setGap(Number(e.target.value))}/>
      <br />
      <br />
      <EventsSnakeGrid
        items={items}
        lineColor={colorScheme === "dark" ? "#D9D9D9" : "#2D3648"}
        cellSize={cellSize}
        columns={columns}
        gap={gap}
      />
    </div>
  );
}
